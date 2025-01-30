import type { FastifyInstance } from "fastify";
import { checkShareOwnership } from "../user-objective-share/guard/check-objective-share-ownership";
import * as objectiveController from "./controller.objective";
import { checkOwnership } from "./guard/check-Objective-Ownership";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { getAllObjectivesFSchema } from "./schemas/get-all-objectives.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";
import { uuidObjectiveFSchema } from "./schemas/validUUID.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("", { schema: createObjectiveFSchema }, objectiveController.create);
    app.patch("/:id", { schema: updateObjectiveFSchema, preHandler: app.auth([checkOwnership]) }, objectiveController.update);
    app.get("/:id", { schema: uuidObjectiveFSchema, preHandler: app.auth([checkOwnership, checkShareOwnership]) }, objectiveController.getOne);
    app.delete("/:id", { schema: uuidObjectiveFSchema, preHandler: app.auth([checkOwnership]) }, objectiveController.deleteObjective);
    app.get("", { schema: getAllObjectivesFSchema }, objectiveController.getAll);
};
