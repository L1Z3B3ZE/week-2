import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import type { createObjectiveSchema } from "./schemas/create-objective.schema";
import type { updateObjectiveSchema } from "./schemas/update-objective.schema";

export async function create(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    if (!req.user?.id) {
        return rep.code(HttpStatusCode.BAD_REQUEST).send({
            message: "Пользователь не авторизован"
        });
    }

    const newObjective = {
        title: req.body.title,
        description: req.body.description,
        notifyAt: req.body.notifyAt,
        creatorid: req.user.id,
    };

    try {
        const insertedObjective = await objectiveRepository.insert(sqlCon, newObjective);
        return rep.code(HttpStatusCode.CREATED).send(insertedObjective);
    } catch (error) {
        console.error("Ошибка создания задачи:", error);
        return rep.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
            message: "При создании задачи произошла ошибка"
        });
    }
}

export async function update(
    request: FastifyRequest<{
        Params: { id: string };
        Body: updateObjectiveSchema;
    }>,
    reply: FastifyReply
) {
    const { id } = request.params;


    try {
        const objective = await objectiveRepository.getById(sqlCon, id);
        if (!objective) {
            reply.status(404);
            return { error: "Objective not found" };
        }

        const updatedObjective = await objectiveRepository.update(//code here);

        return {
            message: "Objective updated successfully",
            data: updatedObjective,
        };
    } catch (error) {
        request.log.error(error);
        reply.status(500);
        return { error: "An error occurred while updating the objective" };
    }
}
