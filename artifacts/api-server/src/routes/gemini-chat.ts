import { Router, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { db } from "@workspace/db";
import { chatMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set.");
}

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Bạn là Điểm Tựa — người bạn đồng hành tâm lý ấm áp, chân thành, dành riêng cho học sinh và sinh viên Việt Nam.

Vai trò:
- Lắng nghe và thấu hiểu cảm xúc một cách chân thành
- Hỗ trợ tinh thần về áp lực học tập, thi cử, bạn bè, gia đình, tình cảm
- Đưa ra lời khuyên thực tế, dựa trên tâm lý học tích cực
- Khuyến khích tìm đến chuyên gia khi cần

Cách giao tiếp:
- Dùng tiếng Việt gần gũi, ấm áp, xưng "mình - bạn"
- Không phán xét, không áp đặt
- Trả lời ngắn gọn, dễ hiểu
- Đặt câu hỏi để hiểu rõ hơn tình huống

Quan trọng:
- KHÔNG thay thế chuyên gia tâm lý
- Nếu có dấu hiệu tự làm hại bản thân, hướng dẫn ngay: đường dây 1800 599 920 (miễn phí 24/7)`;

// POST /api/chat/gemini  — SSE streaming
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { sessionId, text } = req.body as Record<string, string>;

  if (!sessionId?.trim()) { res.status(400).json({ error: "sessionId là bắt buộc" }); return; }
  if (sessionId.length > 100) { res.status(400).json({ error: "sessionId không hợp lệ" }); return; }
  if (!text?.trim()) { res.status(400).json({ error: "text là bắt buộc" }); return; }
  if (text.length > 4000) { res.status(400).json({ error: "Tin nhắn quá dài (tối đa 4000 ký tự)" }); return; }

  // Load conversation history for context (last 20 messages)
  const history = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(20);

  // Build Gemini contents (oldest first, exclude current message)
  const contents = history.reverse().map((m) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  // Append current user turn
  contents.push({ role: "user", parts: [{ text }] });

  // Flush SSE headers before any DB writes so client knows request was accepted
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

  // Save user message AFTER headers are flushed (stream accepted)
  await db.insert(chatMessagesTable).values({
    sessionId,
    text,
    sender: "user",
    category: null,
  });

  try {
    const stream = await genai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        maxOutputTokens: 8192,
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    for await (const chunk of stream) {
      if (aborted) break;
      const chunkText = chunk.text;
      if (chunkText) {
        fullResponse += chunkText;
        res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
    }
  } catch (err: unknown) {
    if (!aborted) {
      console.error("Gemini streaming error:", err);
      res.write(`data: ${JSON.stringify({ error: "Đã xảy ra lỗi. Vui lòng thử lại." })}\n\n`);
    }
  } finally {
    if (!aborted && fullResponse.length > 0) {
      try {
        await db.insert(chatMessagesTable).values({
          sessionId,
          text: fullResponse,
          sender: "bot",
          category: null,
        });
      } catch (dbErr) {
        console.error("Failed to save bot message:", dbErr);
      }
    }
    if (!aborted) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  }
});

export default router;
