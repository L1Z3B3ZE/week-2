import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import * as objectiveRepository from "../repository.objective";

export const checkOwnership = async (req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const objective = await objectiveRepository.getById(sqlCon, id);

    if (!objective) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({
            message: "Задача с таким ID не найдена"
        });
    }

    if (objective.creatorid !== userId) {
        return rep.code(HttpStatusCode.FORBIDDEN).send({
            message: "У вас нет доступа к этой задаче"
        });
    }

    (req as any).objective = objective;
};
