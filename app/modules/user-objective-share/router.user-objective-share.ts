import type { FastifyInstance } from "fastify";
import { checkOwnership } from "../objective/guard/check-Objective-Ownership";
import { uuidObjectiveFSchema } from "../objective/schemas/validUUID.schema";
import * as userObjectiveShareController from "./controller.user-objective-share";
import { userObjectiveShareFSchema } from "./schemas/user-objective-share.schema";

export const userObjectiveShareRouter = async (app: FastifyInstance) => {
    app.post("/:id/share", { schema: userObjectiveShareFSchema, preHandler: app.auth([checkOwnership]) }, userObjectiveShareController.share);
    app.delete("/:id/revoke", { schema: userObjectiveShareFSchema, preHandler: app.auth([checkOwnership]) }, userObjectiveShareController.revokeObjectiveAccess);
    app.get("/:id/list-grants", { schema: uuidObjectiveFSchema, preHandler: app.auth([checkOwnership]) }, userObjectiveShareController.getSharesForObjective);
};
