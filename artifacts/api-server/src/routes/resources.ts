import { Router } from "express";
import { db } from "@workspace/db";
import { resourcesTable } from "@workspace/db";
import { GetResourceParams, ListResourcesQueryParams } from "@workspace/api-zod";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

router.get("/featured", async (_req, res) => {
  const resources = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.featured, true))
    .orderBy(desc(resourcesTable.createdAt))
    .limit(6);

  return res.json(
    resources.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/", async (req, res) => {
  const parsed = ListResourcesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const { category, limit } = parsed.data;

  const whereClause = category ? eq(resourcesTable.category, category) : undefined;

  const resources = await db
    .select()
    .from(resourcesTable)
    .where(whereClause)
    .orderBy(desc(resourcesTable.createdAt))
    .limit(limit ?? 20);

  return res.json(
    resources.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/:id", async (req, res) => {
  const parsed = GetResourceParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const { id } = parsed.data;
  const [resource] = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.id, id))
    .limit(1);

  if (!resource) {
    return res.status(404).json({ error: "Resource not found" });
  }

  return res.json({
    ...resource,
    createdAt: resource.createdAt.toISOString(),
  });
});

export default router;
