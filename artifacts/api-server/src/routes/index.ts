import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import resourcesRouter from "./resources";
import moodRouter from "./mood";
import hotlinesRouter from "./hotlines";
import faqRouter from "./faq";
import statsRouter from "./stats";
import anthropicRouter from "./anthropic/index";
import geminiChatRouter from "./gemini-chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat/gemini", geminiChatRouter);
router.use("/chat", chatRouter);
router.use("/resources", resourcesRouter);
router.use("/mood", moodRouter);
router.use("/hotlines", hotlinesRouter);
router.use("/faq", faqRouter);
router.use("/stats", statsRouter);
router.use("/anthropic", anthropicRouter);

export default router;
