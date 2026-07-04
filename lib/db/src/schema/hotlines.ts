import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hotlinesTable = pgTable("hotlines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  available24h: boolean("available_24h").notNull().default(false),
  category: text("category").notNull().default("general"),
});

export const insertHotlineSchema = createInsertSchema(hotlinesTable).omit({ id: true });
export type InsertHotline = z.infer<typeof insertHotlineSchema>;
export type Hotline = typeof hotlinesTable.$inferSelect;
