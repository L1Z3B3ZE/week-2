import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: createObjectiveFSchema, config: { isPublic: true } }, objectiveController.create);
    app.patch("/to-do/:id",{schema:updateObjectiveFSchema, config: { isPublic: true } }, objectiveController.update);
};
