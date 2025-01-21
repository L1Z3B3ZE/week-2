import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { objectiveFSchema } from "./schemas/objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: objectiveFSchema, config: { isPublic: true } }, objectiveController.create);
};
