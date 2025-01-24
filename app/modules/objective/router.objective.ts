import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";
import { getAllObjectivesFSchema } from "./schemas/get-all-objectives.schema";
import { uuidObjectiveFSchema } from "./schemas/validUUID.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("", { schema: createObjectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: updateObjectiveFSchema }, objectiveController.update);
    app.get("/:id", { schema: uuidObjectiveFSchema }, objectiveController.getOne);
    app.get("", { schema: getAllObjectivesFSchema }, objectiveController.getAll);
};
