import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { QuotaManager } from "./ai/quotaManager";
import { chat, WORDPRESS_SYSTEM_PROMPT, generateImageWithGemini } from "./ai/services";
import { getAllModels } from "./ai/providers";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============ CONVERSATIONS ============
  app.get("/api/conversations", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { title, model } = req.body;
      const conversation = await storage.createConversation({
        userId,
        title: title || "New Chat",
        model: model || "gemini-2.5-flash",
      });
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      const messages = await storage.getMessagesByConversation(req.params.id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.delete("/api/conversations/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      await storage.deleteConversation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // ============ MESSAGES ============
  app.post("/api/conversations/:id/messages", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { role, content, model, tokensUsed, cost } = req.body;
      const message = await storage.createMessage({
        conversationId: req.params.id,
        role,
        content,
        model,
        tokensUsed,
        cost,
      });
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // ============ QUOTAS ============
  app.get("/api/quotas", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      let quotas = await storage.getApiQuotas(userId);

      // Initialize default quotas if not exist
      if (quotas.length === 0) {
        const defaultQuotas = [
          { userId, provider: "gemini" as const, dailyLimit: 1500, isFree: true },
          { userId, provider: "anthropic" as const, dailyLimit: 1000, isFree: true },
          { userId, provider: "groq" as const, dailyLimit: 10000, isFree: true },
          { userId, provider: "openai" as const, dailyLimit: 100, isFree: false, costPerRequest: "0.002000" },
        ];
        for (const quota of defaultQuotas) {
          await storage.upsertApiQuota(quota);
        }
        quotas = await storage.getApiQuotas(userId);
      }

      res.json(quotas);
    } catch (error) {
      console.error("Error fetching quotas:", error);
      res.status(500).json({ message: "Failed to fetch quotas" });
    }
  });

  // ============ WP PROJECTS ============
  app.get("/api/wp-projects", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getWpProjectsByUser(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching WP projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/wp-projects/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const project = await storage.getWpProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const issues = await storage.getWpIssuesByProject(req.params.id);
      res.json({ ...project, issues });
    } catch (error) {
      console.error("Error fetching WP project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // ============ GENERATED IMAGES ============
  app.get("/api/images", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const images = await storage.getGeneratedImagesByUser(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.delete("/api/images/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      await storage.deleteGeneratedImage(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // ============ ELEMENTOR TEMPLATES ============
  app.get("/api/elementor-templates", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const templates = await storage.getElementorTemplatesByUser(userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.delete("/api/elementor-templates/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      await storage.deleteElementorTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // ============ WALLET ============
  app.get("/api/wallet/transactions", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getWalletTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ============ USER SETTINGS ============
  app.patch("/api/user/settings", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { language, theme, firstName, lastName } = req.body;
      const user = await storage.updateUser(userId, {
        language,
        theme,
        firstName,
        lastName,
      });
      res.json(user);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // ============ AI CHAT ============
  app.post("/api/chat", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { conversationId, message, modelId = "gemini-2.5-flash" } = req.body;

      if (!message || !conversationId) {
        return res.status(400).json({ message: "Message and conversationId are required" });
      }

      // Check quota and get best available provider
      const quotaManager = new QuotaManager(userId);
      const quotaResult = await quotaManager.checkAndGetBestProvider(modelId);

      if (!quotaResult.canProceed) {
        return res.status(429).json({
          message: "All free API quotas exhausted. Please add funds to your wallet for paid usage.",
          quotaStatus: quotaManager.getQuotaStatus(),
        });
      }

      // Save user message
      await storage.createMessage({
        conversationId,
        role: "user",
        content: message,
        model: quotaResult.model.id,
      });

      // Get conversation history for context
      const allMessages = await storage.getMessagesByConversation(conversationId);
      const chatHistory = allMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // Add system prompt
      const messagesWithSystem = [
        { role: "system" as const, content: WORDPRESS_SYSTEM_PROMPT },
        ...chatHistory,
      ];

      // Call AI
      const aiResponse = await chat(messagesWithSystem, quotaResult.model.id);

      // Save assistant response
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.content,
        model: quotaResult.model.id,
        tokensUsed: aiResponse.tokensUsed,
        cost: quotaResult.cost > 0 ? quotaResult.cost.toFixed(6) : undefined,
      });

      // Increment usage
      await quotaManager.incrementUsage(quotaResult.provider);

      // Update conversation title if it's the first message
      const conversation = await storage.getConversation(conversationId);
      if (conversation && conversation.title === "New Chat" && allMessages.length <= 1) {
        const title = message.substring(0, 50) + (message.length > 50 ? "..." : "");
        await storage.updateConversationTitle(conversationId, title);
      }

      res.json({
        message: assistantMessage,
        usedModel: quotaResult.model.name,
        switchedProvider: quotaResult.switchedProvider,
        quotaRemaining: quotaResult.quotaRemaining,
      });
    } catch (error: any) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: error.message || "Failed to process chat" });
    }
  });

  // ============ AI MODELS ============
  app.get("/api/ai/models", isAuthenticated, async (_req: any, res: Response) => {
    try {
      const models = getAllModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  // ============ IMAGE GENERATION ============
  app.post("/api/images/generate", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt, style = "realistic" } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Check quota
      const quotaManager = new QuotaManager(userId);
      const quotaResult = await quotaManager.checkAndGetBestProvider("gemini-2.5-flash");

      if (!quotaResult.canProceed) {
        return res.status(429).json({
          message: "All free API quotas exhausted",
        });
      }

      // Generate image
      const fullPrompt = `${style} style: ${prompt}`;
      const imageData = await generateImageWithGemini(fullPrompt);

      if (!imageData) {
        return res.status(500).json({ message: "Failed to generate image" });
      }

      // Save to database
      const generatedImage = await storage.createGeneratedImage({
        userId,
        prompt,
        style,
        imageUrl: imageData,
        model: "gemini-2.0-flash-preview-image-generation",
      });

      // Increment usage
      await quotaManager.incrementUsage(quotaResult.provider);

      res.json(generatedImage);
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: error.message || "Failed to generate image" });
    }
  });

  return httpServer;
}
