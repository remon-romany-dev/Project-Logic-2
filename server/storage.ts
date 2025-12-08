import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  conversations,
  messages,
  apiQuotas,
  wpProjects,
  wpIssues,
  generatedImages,
  elementorTemplates,
  walletTransactions,
  type User,
  type UpsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type ApiQuota,
  type InsertApiQuota,
  type WpProject,
  type InsertWpProject,
  type WpIssue,
  type InsertWpIssue,
  type GeneratedImage,
  type InsertGeneratedImage,
  type ElementorTemplate,
  type InsertElementorTemplate,
  type WalletTransaction,
  type InsertWalletTransaction,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Conversations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  createConversation(data: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined>;
  updateConversationTitle(id: string, title: string): Promise<Conversation | undefined>;
  deleteConversation(id: string): Promise<void>;

  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;

  // API Quotas
  getApiQuotas(userId: string): Promise<ApiQuota[]>;
  upsertApiQuota(data: InsertApiQuota): Promise<ApiQuota>;
  resetDailyQuotas(): Promise<void>;

  // WP Projects
  getWpProject(id: string): Promise<WpProject | undefined>;
  getWpProjectsByUser(userId: string): Promise<WpProject[]>;
  createWpProject(data: InsertWpProject): Promise<WpProject>;

  // WP Issues
  getWpIssuesByProject(projectId: string): Promise<WpIssue[]>;
  createWpIssue(data: InsertWpIssue): Promise<WpIssue>;

  // Generated Images
  getGeneratedImage(id: string): Promise<GeneratedImage | undefined>;
  getGeneratedImagesByUser(userId: string): Promise<GeneratedImage[]>;
  createGeneratedImage(data: InsertGeneratedImage): Promise<GeneratedImage>;
  deleteGeneratedImage(id: string): Promise<void>;

  // Elementor Templates
  getElementorTemplate(id: string): Promise<ElementorTemplate | undefined>;
  getElementorTemplatesByUser(userId: string): Promise<ElementorTemplate[]>;
  createElementorTemplate(data: InsertElementorTemplate): Promise<ElementorTemplate>;
  deleteElementorTemplate(id: string): Promise<void>;

  // Wallet Transactions
  getWalletTransactionsByUser(userId: string): Promise<WalletTransaction[]>;
  createWalletTransaction(data: InsertWalletTransaction): Promise<WalletTransaction>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Conversations
  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return conv;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [conv] = await db.insert(conversations).values(data).returning();
    return conv;
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined> {
    const [conv] = await db
      .update(conversations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conv;
  }

  async updateConversationTitle(id: string, title: string): Promise<Conversation | undefined> {
    return this.updateConversation(id, { title });
  }

  async deleteConversation(id: string): Promise<void> {
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    const [msg] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return msg;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(data).returning();
    // Update conversation timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, data.conversationId));
    return msg;
  }

  // API Quotas
  async getApiQuotas(userId: string): Promise<ApiQuota[]> {
    return db.select().from(apiQuotas).where(eq(apiQuotas.userId, userId));
  }

  async upsertApiQuota(data: InsertApiQuota): Promise<ApiQuota> {
    const [quota] = await db
      .insert(apiQuotas)
      .values(data)
      .onConflictDoUpdate({
        target: [apiQuotas.userId, apiQuotas.provider],
        set: {
          usedToday: data.usedToday,
          dailyLimit: data.dailyLimit,
        },
      })
      .returning();
    return quota;
  }

  async resetDailyQuotas(): Promise<void> {
    await db.update(apiQuotas).set({ usedToday: 0, lastResetAt: new Date() });
  }

  // WP Projects
  async getWpProject(id: string): Promise<WpProject | undefined> {
    const [project] = await db.select().from(wpProjects).where(eq(wpProjects.id, id)).limit(1);
    return project;
  }

  async getWpProjectsByUser(userId: string): Promise<WpProject[]> {
    return db
      .select()
      .from(wpProjects)
      .where(eq(wpProjects.userId, userId))
      .orderBy(desc(wpProjects.createdAt));
  }

  async createWpProject(data: InsertWpProject): Promise<WpProject> {
    const [project] = await db.insert(wpProjects).values(data).returning();
    return project;
  }

  // WP Issues
  async getWpIssuesByProject(projectId: string): Promise<WpIssue[]> {
    return db.select().from(wpIssues).where(eq(wpIssues.projectId, projectId));
  }

  async createWpIssue(data: InsertWpIssue): Promise<WpIssue> {
    const [issue] = await db.insert(wpIssues).values(data).returning();
    return issue;
  }

  // Generated Images
  async getGeneratedImage(id: string): Promise<GeneratedImage | undefined> {
    const [img] = await db.select().from(generatedImages).where(eq(generatedImages.id, id)).limit(1);
    return img;
  }

  async getGeneratedImagesByUser(userId: string): Promise<GeneratedImage[]> {
    return db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.userId, userId))
      .orderBy(desc(generatedImages.createdAt));
  }

  async createGeneratedImage(data: InsertGeneratedImage): Promise<GeneratedImage> {
    const [img] = await db.insert(generatedImages).values(data).returning();
    return img;
  }

  async deleteGeneratedImage(id: string): Promise<void> {
    await db.delete(generatedImages).where(eq(generatedImages.id, id));
  }

  // Elementor Templates
  async getElementorTemplate(id: string): Promise<ElementorTemplate | undefined> {
    const [tpl] = await db.select().from(elementorTemplates).where(eq(elementorTemplates.id, id)).limit(1);
    return tpl;
  }

  async getElementorTemplatesByUser(userId: string): Promise<ElementorTemplate[]> {
    return db
      .select()
      .from(elementorTemplates)
      .where(eq(elementorTemplates.userId, userId))
      .orderBy(desc(elementorTemplates.createdAt));
  }

  async createElementorTemplate(data: InsertElementorTemplate): Promise<ElementorTemplate> {
    const [tpl] = await db.insert(elementorTemplates).values(data).returning();
    return tpl;
  }

  async deleteElementorTemplate(id: string): Promise<void> {
    await db.delete(elementorTemplates).where(eq(elementorTemplates.id, id));
  }

  // Wallet Transactions
  async getWalletTransactionsByUser(userId: string): Promise<WalletTransaction[]> {
    return db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt));
  }

  async createWalletTransaction(data: InsertWalletTransaction): Promise<WalletTransaction> {
    const [tx] = await db.insert(walletTransactions).values(data).returning();
    return tx;
  }
}

export const storage = new DatabaseStorage();
