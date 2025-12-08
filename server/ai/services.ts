// AI Service implementations for Remon Romany Genius
// Integrates with Gemini, Anthropic, OpenAI, Groq

import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}

// Gemini AI Service
export async function chatWithGemini(
  messages: ChatMessage[],
  model: string = "gemini-2.5-flash"
): Promise<ChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert messages to Gemini format
  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const contents = chatMessages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: systemMessage
      ? { systemInstruction: systemMessage.content }
      : undefined,
  });

  return {
    content: response.text || "",
    model,
  };
}

// Anthropic Claude Service
export async function chatWithClaude(
  messages: ChatMessage[],
  model: string = "claude-sonnet-4-20250514"
): Promise<ChatResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });

  // Extract system message
  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemMessage?.content,
    messages: chatMessages,
  });

  const textContent = response.content.find((c) => c.type === "text");
  
  return {
    content: textContent?.text || "",
    model,
    tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens,
  };
}

// OpenAI Service
export async function chatWithOpenAI(
  messages: ChatMessage[],
  model: string = "gpt-4o"
): Promise<ChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return {
    content: response.choices[0]?.message?.content || "",
    model,
    tokensUsed: response.usage?.total_tokens,
  };
}

// Groq Service (uses OpenAI-compatible API)
export async function chatWithGroq(
  messages: ChatMessage[],
  model: string = "llama-3.3-70b-versatile"
): Promise<ChatResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
    model,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return {
    content: response.choices[0]?.message?.content || "",
    model,
    tokensUsed: response.usage?.total_tokens,
  };
}

// Unified chat function that routes to the correct provider
export async function chat(
  messages: ChatMessage[],
  modelId: string
): Promise<ChatResponse> {
  // Determine provider from model ID
  if (modelId.startsWith("gemini")) {
    return chatWithGemini(messages, modelId);
  } else if (modelId.startsWith("claude")) {
    return chatWithClaude(messages, modelId);
  } else if (modelId.startsWith("gpt")) {
    return chatWithOpenAI(messages, modelId);
  } else if (modelId.includes("llama") || modelId.includes("mixtral")) {
    return chatWithGroq(messages, modelId);
  }

  // Default to Gemini
  return chatWithGemini(messages, "gemini-2.5-flash");
}

// WordPress-specific system prompt
export const WORDPRESS_SYSTEM_PROMPT = `You are Remon Romany Genius, an expert AI assistant specialized in WordPress development.

Your expertise includes:
- WordPress theme and plugin development
- PHP, JavaScript, CSS, HTML
- WordPress hooks, filters, and actions
- WooCommerce development
- Elementor and other page builders
- WordPress security best practices
- Performance optimization
- Database optimization
- REST API development
- Gutenberg block development

When providing code:
1. Always use proper WordPress coding standards
2. Include security measures (escaping, sanitization, nonces)
3. Follow WordPress naming conventions
4. Add helpful comments
5. Consider backward compatibility

Format code blocks with proper syntax highlighting using markdown.`;

// Image generation using Gemini
export async function generateImageWithGemini(
  prompt: string
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return null;
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      return null;
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // Return base64 image data
        return `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
