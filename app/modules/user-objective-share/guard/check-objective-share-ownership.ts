import { FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import * as objectiveRepository from "../../objective/repository.objective";
import * as userObjectiveShareRepository from "../repository.user-objective-share";

export const checkShareOwnership = async (req: FastifyRequest<{ Params: { id: string } }>) => {
    const { id } = req.params;

    const objective = await objectiveRepository.getById(sqlCon, id);

    if (!objective) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "Задача с таким ID не найдена", {
            publicMessage: "Задача с таким ID не найдена"
        });
    }

    if (!(await userObjectiveShareRepository.findShareByUserAndObjectiveIds(sqlCon, req.user.id!, objective.id))) {
        throw new CustomException(HttpStatusCode.FORBIDDEN, "Доступ отклонен", {
            publicMessage: { message: "У вас нет доступа к этой задаче" }
        });
    }
};
