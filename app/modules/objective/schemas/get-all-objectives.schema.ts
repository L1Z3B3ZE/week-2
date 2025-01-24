import type { FastifySchema } from "fastify";
import { z } from "zod";

const SortOrders = z.enum(["asc", "desc"]);

const schema = z.object({
    search: z.string().optional(),
    isCompleted: z.preprocess((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    }, z.boolean().optional()),
    sortTitle: SortOrders.optional(),
    sortCreatedAt: SortOrders.optional(),
    sortNotifyAt: SortOrders.optional(),
    order: SortOrders.optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});

export type getAllObjectivesSchema = z.infer<typeof schema>;
export const getAllObjectivesFSchema: FastifySchema = { querystring: schema };
