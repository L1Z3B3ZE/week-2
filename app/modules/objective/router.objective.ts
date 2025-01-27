import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { checkOwnership } from "./guard/check-Objective-Ownership";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { getAllObjectivesFSchema } from "./schemas/get-all-objectives.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";
import { uuidObjectiveFSchema } from "./schemas/validUUID.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("", { schema: createObjectiveFSchema, config: { isPublic: false } }, objectiveController.create);
    app.patch("/:id", { schema: updateObjectiveFSchema, config: { isPublic: false }, preHandler: app.auth([checkOwnership]) }, objectiveController.update);
    app.get("/:id", { schema: uuidObjectiveFSchema, config: { isPublic: false }, preHandler: app.auth([checkOwnership]) }, objectiveController.getOne);
    app.get("", { schema: getAllObjectivesFSchema, config: { isPublic: false } }, objectiveController.getAll);
};
