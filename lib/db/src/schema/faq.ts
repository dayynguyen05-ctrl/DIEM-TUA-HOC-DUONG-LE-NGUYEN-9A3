import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const faqCategoriesTable = pgTable("faq_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const faqItemsTable = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertFaqCategorySchema = createInsertSchema(faqCategoriesTable).omit({ id: true });
export const insertFaqItemSchema = createInsertSchema(faqItemsTable).omit({ id: true });
export type InsertFaqCategory = z.infer<typeof insertFaqCategorySchema>;
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqCategory = typeof faqCategoriesTable.$inferSelect;
export type FaqItem = typeof faqItemsTable.$inferSelect;
