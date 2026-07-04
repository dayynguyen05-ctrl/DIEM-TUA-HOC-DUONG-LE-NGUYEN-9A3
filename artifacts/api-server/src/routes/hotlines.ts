import { Router } from "express";
import { db } from "@workspace/db";
import { hotlinesTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  const hotlines = await db.select().from(hotlinesTable);
  return res.json(hotlines);
});

export default router;
