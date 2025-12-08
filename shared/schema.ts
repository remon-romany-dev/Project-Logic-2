import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const languageEnum = pgEnum("language", ["ar", "en", "de", "fr", "es"]);
export const themeEnum = pgEnum("theme", ["light", "dark"]);
export const aiProviderEnum = pgEnum("ai_provider", ["openai", "anthropic", "gemini", "groq", "together", "cohere"]);
export const analysisTypeEnum = pgEnum("analysis_type", ["security", "performance", "code_quality"]);
export const severityEnum = pgEnum("severity", ["critical", "high", "medium", "low"]);

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  language: languageEnum("language").default("en"),
  theme: themeEnum("theme").default("dark"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Quotas tracking
export const apiQuotas = pgTable("api_quotas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: aiProviderEnum("provider").notNull(),
  usedToday: integer("used_today").default(0),
  dailyLimit: integer("daily_limit").notNull(),
  costPerRequest: decimal("cost_per_request", { precision: 10, scale: 6 }).default("0.000000"),
  isFree: boolean("is_free").default(true),
  lastResetAt: timestamp("last_reset_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").default("New Chat"),
  model: varchar("model").default("gemini-2.5-flash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  model: varchar("model"),
  tokensUsed: integer("tokens_used").default(0),
  cost: decimal("cost", { precision: 10, scale: 6 }).default("0.000000"),
  createdAt: timestamp("created_at").defaultNow(),
});

// WordPress analysis projects
export const wpProjects = pgTable("wp_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'theme' | 'plugin'
  version: varchar("version"),
  securityScore: integer("security_score"),
  performanceScore: integer("performance_score"),
  codeQualityScore: integer("code_quality_score"),
  analysisData: jsonb("analysis_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// WordPress analysis issues
export const wpIssues = pgTable("wp_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => wpProjects.id, { onDelete: "cascade" }),
  type: analysisTypeEnum("type").notNull(),
  severity: severityEnum("severity").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  filePath: varchar("file_path"),
  lineNumber: integer("line_number"),
  codeSnippet: text("code_snippet"),
  suggestedFix: text("suggested_fix"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated images
export const generatedImages = pgTable("generated_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  imageUrl: varchar("image_url").notNull(),
  model: varchar("model").notNull(), // 'dall-e-3' | 'stable-diffusion'
  size: varchar("size"),
  style: varchar("style"),
  cost: decimal("cost", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Elementor templates
export const elementorTemplates = pgTable("elementor_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  templateJson: jsonb("template_json").notNull(),
  previewImageUrl: varchar("preview_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet transactions
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'deposit' | 'usage' | 'refund'
  description: varchar("description"),
  stripePaymentId: varchar("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  apiQuotas: many(apiQuotas),
  wpProjects: many(wpProjects),
  generatedImages: many(generatedImages),
  elementorTemplates: many(elementorTemplates),
  walletTransactions: many(walletTransactions),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

export const apiQuotasRelations = relations(apiQuotas, ({ one }) => ({
  user: one(users, { fields: [apiQuotas.userId], references: [users.id] }),
}));

export const wpProjectsRelations = relations(wpProjects, ({ one, many }) => ({
  user: one(users, { fields: [wpProjects.userId], references: [users.id] }),
  issues: many(wpIssues),
}));

export const wpIssuesRelations = relations(wpIssues, ({ one }) => ({
  project: one(wpProjects, { fields: [wpIssues.projectId], references: [wpProjects.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertApiQuotaSchema = createInsertSchema(apiQuotas).omit({ id: true, createdAt: true });
export const insertWpProjectSchema = createInsertSchema(wpProjects).omit({ id: true, createdAt: true });
export const insertWpIssueSchema = createInsertSchema(wpIssues).omit({ id: true, createdAt: true });
export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({ id: true, createdAt: true });
export const insertElementorTemplateSchema = createInsertSchema(elementorTemplates).omit({ id: true, createdAt: true });
export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type ApiQuota = typeof apiQuotas.$inferSelect;
export type InsertApiQuota = z.infer<typeof insertApiQuotaSchema>;
export type WpProject = typeof wpProjects.$inferSelect;
export type InsertWpProject = z.infer<typeof insertWpProjectSchema>;
export type WpIssue = typeof wpIssues.$inferSelect;
export type InsertWpIssue = z.infer<typeof insertWpIssueSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type ElementorTemplate = typeof elementorTemplates.$inferSelect;
export type InsertElementorTemplate = z.infer<typeof insertElementorTemplateSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
