import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";
import { getAllObjectivesFSchema } from "./schemas/get-all-objectives.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: createObjectiveFSchema }, objectiveController.create);
    app.patch("/to-do/:id", { schema: updateObjectiveFSchema }, objectiveController.update);
    app.get("/to-do/:id", {}, objectiveController.getOne);
    app.get("/to-do", { schema: getAllObjectivesFSchema }, objectiveController.getAll);
};
