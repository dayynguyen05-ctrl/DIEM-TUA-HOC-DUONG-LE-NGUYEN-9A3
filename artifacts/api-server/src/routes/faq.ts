import { Router } from "express";
import { db } from "@workspace/db";
import { faqCategoriesTable, faqItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const categories = await db
    .select()
    .from(faqCategoriesTable)
    .orderBy(asc(faqCategoriesTable.sortOrder));

  const items = await db
    .select()
    .from(faqItemsTable)
    .orderBy(asc(faqItemsTable.sortOrder));

  const result = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    questions: items
      .filter((item) => item.categoryId === cat.id)
      .map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
      })),
  }));

  return res.json(result);
});

export default router;
