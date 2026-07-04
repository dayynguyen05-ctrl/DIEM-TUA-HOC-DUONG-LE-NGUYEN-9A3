import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// GET /anthropic/conversations?sessionId=xxx
router.get("/", async (req, res) => {
  const { sessionId } = req.query as Record<string, string>;
  if (!sessionId?.trim()) return res.status(400).json({ error: "sessionId is required" });

  const rows = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId))
    .orderBy(desc(conversations.createdAt));

  return res.json(rows.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

// POST /anthropic/conversations
router.post("/", async (req, res) => {
  const { title, sessionId } = req.body as Record<string, string>;
  if (!title?.trim()) return res.status(400).json({ error: "title is required" });
  if (!sessionId?.trim()) return res.status(400).json({ error: "sessionId is required" });
  if (title.length > 200) return res.status(400).json({ error: "title too long" });
  if (sessionId.length > 100) return res.status(400).json({ error: "sessionId too long" });

  const [conv] = await db
    .insert(conversations)
    .values({ title, sessionId })
    .returning();

  return res.status(201).json({ ...conv, createdAt: conv.createdAt.toISOString() });
});

// GET /anthropic/conversations/:id?sessionId=xxx
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const { sessionId } = req.query as Record<string, string>;
  if (!sessionId?.trim()) return res.status(400).json({ error: "sessionId is required" });

  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.sessionId, sessionId)));

  if (!conv) return res.status(404).json({ error: "Không tìm thấy cuộc trò chuyện" });

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  return res.json({
    ...conv,
    createdAt: conv.createdAt.toISOString(),
    messages: msgs.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
  });
});

// DELETE /anthropic/conversations/:id?sessionId=xxx
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const { sessionId } = req.query as Record<string, string>;
  if (!sessionId?.trim()) return res.status(400).json({ error: "sessionId is required" });

  const deleted = await db
    .delete(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.sessionId, sessionId)))
    .returning();

  if (!deleted.length) return res.status(404).json({ error: "Không tìm thấy cuộc trò chuyện" });

  return res.status(204).send();
});

export default router;
