import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import type { createObjectiveSchema } from "./schemas/create-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";
import { getAllObjectivesSchema } from "./schemas/get-all-objectives.schema";

export async function create(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    if (!req.user?.id) {
        return rep.code(HttpStatusCode.UNAUTHORIZED).send({
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
        return rep.code(HttpStatusCode.OK).send(insertedObjective);
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
        return rep.code(HttpStatusCode.UNAUTHORIZED).send({
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

export async function getOne(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    if (!req.user?.id) {
        return rep.code(HttpStatusCode.UNAUTHORIZED).send({
            message: "Пользователь не авторизован"
        });
    }

    try {
        const objective = await objectiveRepository.getById(sqlCon, req.params.id);

        if (objective.creatorid !== req.user.id) {
            return rep.code(HttpStatusCode.FORBIDDEN).send({
                message: "У вас нет доступа к этой задаче"
            });
        }

        return rep.code(HttpStatusCode.OK).send(objective);
    } catch (error) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({
            message: "Задача с таким ID не найдена"
        });
    }
}

export async function getAll(req: FastifyRequest<{ Querystring: getAllObjectivesSchema }>, rep: FastifyReply) {
    if (!req.user?.id) {
        return rep.code(HttpStatusCode.UNAUTHORIZED).send({
            message: "Пользователь не авторизован"
        });
    }

    try {
        const objectives = await objectiveRepository.getAll(sqlCon, req.user.id, req.query);

        return rep.code(HttpStatusCode.OK).send(objectives);
    } catch (error) {
        console.error("Ошибка при получении списка задач:", error);
        return rep.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
            message: "Произошла ошибка при получении задач"
        });
    }
}
