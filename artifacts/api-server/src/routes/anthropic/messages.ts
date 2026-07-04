import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router = Router({ mergeParams: true });

const SYSTEM_PROMPT = `Bạn là Điểm Tựa — một người bạn đồng hành tâm lý ấm áp, chân thành, dành riêng cho học sinh và sinh viên Việt Nam.

Vai trò của bạn:
- Lắng nghe và thấu hiểu cảm xúc của người dùng một cách chân thành
- Hỗ trợ tinh thần về các vấn đề học đường: áp lực học tập, thi cử, bạn bè, gia đình, tình cảm
- Cung cấp những lời khuyên thực tế, dựa trên tâm lý học tích cực
- Khuyến khích người dùng mở lòng và tìm đến chuyên gia khi cần

Cách giao tiếp:
- Dùng tiếng Việt gần gũi, ấm áp, như người bạn thật sự
- Xưng hô "mình - bạn" thân mật
- Không phán xét, không áp đặt
- Trả lời ngắn gọn, dễ hiểu (tránh quá dài dòng)
- Đặt câu hỏi để hiểu rõ hơn về tình huống của người dùng

Giới hạn quan trọng:
- KHÔNG thay thế chuyên gia tâm lý
- Nếu người dùng có dấu hiệu tự làm hại bản thân hoặc nguy hiểm, hãy ngay lập tức hướng dẫn gọi đường dây hỗ trợ khẩn cấp: 1800 599 920 (miễn phí 24/7)
- Không cung cấp thông tin y tế hoặc pháp lý chuyên nghiệp`;

// GET /anthropic/conversations/:id/messages
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  res.json(msgs.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

// POST /anthropic/conversations/:id/messages (SSE streaming)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { content, sessionId } = req.body as Record<string, string>;
  if (!content?.trim()) { res.status(400).json({ error: "content is required" }); return; }
  if (!sessionId?.trim()) { res.status(400).json({ error: "sessionId is required" }); return; }
  if (content.length > 4000) { res.status(400).json({ error: "content too long (max 4000 chars)" }); return; }

  // Verify conversation belongs to this session
  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.sessionId, sessionId)));
  if (!conv) { res.status(404).json({ error: "Không tìm thấy cuộc trò chuyện" }); return; }

  // Save user message
  await db.insert(messages).values({ conversationId: id, role: "user", content });

  // Load recent history (cap at 40 to bound context size)
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt)
    .limit(40);

  const chatMessages = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Flush SSE headers immediately
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let fullResponse = "";
  let aborted = false;
  const abortController = new AbortController();

  req.on("close", () => {
    aborted = true;
    abortController.abort();
  });

  try {
    const stream = anthropic.messages.stream(
      {
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: chatMessages,
      },
      { signal: abortController.signal }
    );

    for await (const event of stream) {
      if (aborted) break;
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }
  } catch (err: unknown) {
    if (!aborted) {
      console.error("Claude streaming error:", err);
      res.write(`data: ${JSON.stringify({ error: "Đã xảy ra lỗi. Vui lòng thử lại." })}\n\n`);
    }
  } finally {
    if (!aborted && fullResponse.length > 0) {
      try {
        await db.insert(messages).values({
          conversationId: id,
          role: "assistant",
          content: fullResponse,
        });
      } catch (dbErr) {
        console.error("Failed to save assistant message:", dbErr);
      }
    }
    if (!aborted) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }
});

export default router;
