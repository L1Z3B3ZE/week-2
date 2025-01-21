import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string(),
    notifyAt: z.string().datetime(),
    isCompleted: z.boolean().optional()
});

export type updateObjectiveSchema = z.infer<typeof schema>;
export const updateObjectiveFSchema: FastifySchema = { body: schema };
