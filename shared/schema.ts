import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const anime = pgTable("anime", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  posterUrl: text("poster_url").notNull(),
  genres: text("genres").array().notNull(),
  episodes: integer("episodes").notNull(),
  language: text("language").notNull(), // "sub", "dub", "both"
  status: text("status").notNull(), // "ongoing", "completed"
  telegramUrl: text("telegram_url").notNull(),
  isRecommended: boolean("is_recommended").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertAnimeSchema = createInsertSchema(anime).omit({
  id: true,
  views: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Anime = typeof anime.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
