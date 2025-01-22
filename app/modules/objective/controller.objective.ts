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
        creatorid: req.user.id
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

export async function update(req: FastifyRequest<{ Body: updateObjectiveSchema; Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    if (!req.user?.id) {
        return rep.code(HttpStatusCode.BAD_REQUEST).send({
            message: "Пользователь не авторизован"
        });
    }

    const updatedObjective = await objectiveRepository.update(sqlCon, id, req.body);
    try {
        return rep.code(HttpStatusCode.OK).send({ ...updatedObjective });
    } catch (error) {
        console.error("Ошибка при редактировании задачи:", error);
        return rep.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
            message: "Произошла ошибка при редактировании задачи"
        });
    }
}
