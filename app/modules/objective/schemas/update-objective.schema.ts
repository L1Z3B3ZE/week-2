import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127).optional(),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().optional(),
    isCompleted: z.preprocess((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    }, z.boolean().optional())
});

export type updateObjectiveSchema = z.infer<typeof schema>;
export const updateObjectiveFSchema: FastifySchema = { body: schema };
