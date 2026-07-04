import { Router } from "express";
import { db } from "@workspace/db";
import { resourcesTable, hotlinesTable, faqItemsTable } from "@workspace/db";
import { count } from "drizzle-orm";

const router = Router();

router.get("/overview", async (_req, res) => {
  const [resourceCount] = await db.select({ count: count() }).from(resourcesTable);
  const [hotlineCount] = await db.select({ count: count() }).from(hotlinesTable);
  const [faqCount] = await db.select({ count: count() }).from(faqItemsTable);

  return res.json({
    totalResources: Number(resourceCount.count),
    totalHotlines: Number(hotlineCount.count),
    totalFaqItems: Number(faqCount.count),
    supportCategories: ["Học tập", "Tâm lý", "Quan hệ xã hội", "Sức khỏe", "Gia đình", "Tương lai"],
  });
});

export default router;
