import { FastifySchema } from "fastify";
import { z } from "zod";
import { uuidObjectiveFSchema, uuidObjectiveSchema } from "../../objective/schemas/validUUID.schema";

const schema = z.object({
    id: z.string()
});

const usersSchema = z.object({
    users: z.array(schema)
});

export type UserObjectiveShareSchema = z.infer<typeof usersSchema>;
export const userObjectiveShareFSchema: FastifySchema = { body: usersSchema, params: uuidObjectiveFSchema.params };

export interface IUserObjectiveShareFSchema {
    Body: UserObjectiveShareSchema;
    Params: uuidObjectiveSchema;
}
