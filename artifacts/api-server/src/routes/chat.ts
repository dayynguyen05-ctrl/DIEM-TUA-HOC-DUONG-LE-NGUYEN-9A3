import { Router } from "express";
import { db } from "@workspace/db";
import { chatMessagesTable } from "@workspace/db";
import { SendChatMessageBody, GetChatHistoryQueryParams } from "@workspace/api-zod";
import { getBotResponse } from "../lib/chatbot.js";
import { desc, eq, and } from "drizzle-orm";

const router = Router();

router.post("/message", async (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { sessionId, text } = parsed.data;

  const recentMessages = await db
    .select()
    .from(chatMessagesTable)
    .where(and(eq(chatMessagesTable.sessionId, sessionId), eq(chatMessagesTable.sender, "user")))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(5);

  const history = recentMessages.map((m) => m.text).reverse();

  const botResponse = getBotResponse(text, history);

  const [userMsg] = await db
    .insert(chatMessagesTable)
    .values({ sessionId, text, sender: "user", category: null })
    .returning();

  const [botMsg] = await db
    .insert(chatMessagesTable)
    .values({
      sessionId,
      text: botResponse.text,
      sender: "bot",
      category: botResponse.category,
    })
    .returning();

  return res.json({
    userMessage: {
      ...userMsg,
      createdAt: userMsg.createdAt.toISOString(),
    },
    botMessage: {
      ...botMsg,
      createdAt: botMsg.createdAt.toISOString(),
    },
    suggestedReplies: botResponse.suggestedReplies,
    category: botResponse.category,
  });
});

router.get("/history", async (req, res) => {
  const parsed = GetChatHistoryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const { sessionId, limit } = parsed.data;
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(limit ?? 50);

  return res.json(
    messages.reverse().map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }))
  );
});

export default router;
