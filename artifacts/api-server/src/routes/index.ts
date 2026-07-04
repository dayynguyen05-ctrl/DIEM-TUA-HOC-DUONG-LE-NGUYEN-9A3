import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import resourcesRouter from "./resources";
import moodRouter from "./mood";
import hotlinesRouter from "./hotlines";
import faqRouter from "./faq";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat", chatRouter);
router.use("/resources", resourcesRouter);
router.use("/mood", moodRouter);
router.use("/hotlines", hotlinesRouter);
router.use("/faq", faqRouter);
router.use("/stats", statsRouter);

export default router;
