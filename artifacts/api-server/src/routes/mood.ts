import { Router } from "express";
import { db } from "@workspace/db";
import { moodEntriesTable } from "@workspace/db";
import { LogMoodBody, GetMoodHistoryQueryParams } from "@workspace/api-zod";
import { and, eq, gte, desc } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = LogMoodBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { sessionId, mood, score, note } = parsed.data;

  const [entry] = await db
    .insert(moodEntriesTable)
    .values({ sessionId, mood, score, note: note ?? null })
    .returning();

  return res.status(201).json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.get("/", async (req, res) => {
  const parsed = GetMoodHistoryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const { sessionId, days } = parsed.data;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - (days ?? 7));

  const entries = await db
    .select()
    .from(moodEntriesTable)
    .where(and(eq(moodEntriesTable.sessionId, sessionId), gte(moodEntriesTable.createdAt, daysAgo)))
    .orderBy(desc(moodEntriesTable.createdAt))
    .limit(100);

  return res.json(
    entries.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    }))
  );
});

export default router;
