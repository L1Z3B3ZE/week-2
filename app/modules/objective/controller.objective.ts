import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import type { createObjectiveSchema } from "./schemas/create-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";
import { getAllObjectivesSchema } from "./schemas/get-all-objectives.schema";
import { uuidObjectiveSchema } from "./schemas/validUUID.schema";

export async function create(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    const newObjective = {
        ...req.body,
        creatorid: req.user.id!
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, newObjective);
    return rep.code(HttpStatusCode.OK).send(insertedObjective);
}

export async function update(req: FastifyRequest<{ Body: updateObjectiveSchema; Params: uuidObjectiveSchema }>, rep: FastifyReply) {
    const { id } = req.params;

    const updatedObjective = await objectiveRepository.update(sqlCon, id, req.body);
    return rep.code(HttpStatusCode.OK).send({ ...updatedObjective });
}

export async function getOne(req: FastifyRequest<{ Params: uuidObjectiveSchema }>, rep: FastifyReply) {
    const objective = await objectiveRepository.getById(sqlCon, req.params.id);
    return rep.code(HttpStatusCode.OK).send(objective);
}

export async function getAll(req: FastifyRequest<{ Querystring: getAllObjectivesSchema }>, rep: FastifyReply) {
    const objectives = await objectiveRepository.getAll(sqlCon, req.user.id!, req.query);

    return rep.code(HttpStatusCode.OK).send(objectives);
}
