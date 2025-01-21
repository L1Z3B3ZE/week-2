import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import type { objectiveSchema } from "./schemas/objective.schema";

export async function create(req: FastifyRequest<{ Body: objectiveSchema }>, rep: FastifyReply) {
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
        isCompleted: req.body.isCompleted
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
