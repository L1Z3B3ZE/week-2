import { FastifySchema } from "fastify";
import { z } from "zod";

const SortOrders = z.enum(["asc", "desc"]);
const SortFields = z.enum(["title", "createdAt", "notifyAt"]);

const schema = z.object({
    search: z.string().optional(),
    isCompleted: z.preprocess((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return undefined;
    }, z.boolean().optional()),
    sortBy: SortFields.optional(),
    sortOrder: SortOrders.optional(),
    limit: z.coerce.number().min(1),
    offset: z.coerce.number().min(0),
});

export type getAllObjectivesSchema = z.infer<typeof schema>;
export const getAllObjectivesFSchema: FastifySchema = { querystring: schema };
