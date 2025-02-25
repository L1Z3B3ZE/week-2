import { FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import * as objectiveRepository from "../repository.objective";
import { CustomException } from "../../../common/exceptions/custom-exception";

export const checkOwnership = async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const objective = await objectiveRepository.getById(sqlCon, id);

    if (!objective) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "Задача с таким ID не найдена", {
            publicMessage: "Задача с таким ID не найдена"
        });
    }

    if (objective.creatorid !== userId) {
        throw new CustomException(HttpStatusCode.FORBIDDEN, "Доступ отклонен", {
            publicMessage: "У вас нет доступа к этой задаче"
        });
    }
};
