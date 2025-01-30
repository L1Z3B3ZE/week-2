import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { sendMail } from "../../common/config/mailer";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import * as objectiveRepository from "../objective/repository.objective";
import { uuidObjectiveSchema } from "../objective/schemas/validUUID.schema";
import * as userRepository from "../user/repository.user";
import * as userObjectiveShareRepository from "./repository.user-objective-share";
import { IUserObjectiveShareFSchema } from "./schemas/user-objective-share.schema";

export async function share(req: FastifyRequest<IUserObjectiveShareFSchema>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { users } = req.body;

    const objective = await objectiveRepository.getById(sqlCon, objectiveId);

    const userIdentificators = users.map((user) => user.id);
    if (userIdentificators.includes(req.user.id!)) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Вы не можете выдать доступ самому себе", {
            publicMessage: "Вы не можете выдать доступ самому себе"
        });
    }

    const existingUserObjectiveShares = await userObjectiveShareRepository.findExistedAccess(sqlCon, userIdentificators, objectiveId);
    if (existingUserObjectiveShares.length > 0) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Доступ к этой задаче уже предоставлен", {
            publicMessage: {
                message: "Доступ к этой задаче уже предоставлен для следующих пользователей:",
                usersIds: existingUserObjectiveShares.map((user) => user.userId)
            }
        });
    }

    const foundUsers = [];
    for (const userId of userIdentificators) {
        try {
            const foundUser = await userRepository.getById(sqlCon, userId);
            foundUsers.push(foundUser);
        } catch {
            return rep.code(HttpStatusCode.NOT_FOUND).send({ message: `Пользователь ${userId} не найден` });
        }
    }

    for (const user of foundUsers) {
        await userObjectiveShareRepository.insert(sqlCon, { userId: user.id, objectiveId });
    }

    for (const user of foundUsers) {
        await sendMail({
            to: user.email,
            subject: "Выдача доступа к задаче",
            text: `Вам предоставлен доступ к задаче с ID: ${objectiveId}.`
        });
    }

    return rep.code(HttpStatusCode.OK).send({
        message: "Доступ успешно выдан",
        users: await userObjectiveShareRepository.findSharesByObjectiveId(sqlCon, objectiveId),
        objective
    });
}

export async function revokeObjectiveAccess(req: FastifyRequest<IUserObjectiveShareFSchema>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;
    const { users } = req.body;

    const userIdentificators = users.map((user) => user.id);
    if (userIdentificators.includes(req.user.id!)) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Вы не можете удалить у себя доступ к задаче", {
            publicMessage: "Вы не можете удалить у себя доступ к задаче"
        });
    }

    const existingAccess = await userObjectiveShareRepository.findExistedAccess(sqlCon, userIdentificators, objectiveId);
    if (existingAccess.length === 0) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "Доступ не найден", {
            publicMessage: "Пользователь/ли не имеют доступа к этой задаче"
        });
    }

    await userObjectiveShareRepository.revoke(sqlCon, userIdentificators, objectiveId);

    return rep.code(HttpStatusCode.OK).send({
        message: "Доступ успешно отозван",
        revokedUsers: userIdentificators
    });
}

export async function getSharesForObjective(req: FastifyRequest<{ Params: uuidObjectiveSchema }>, rep: FastifyReply) {
    const { id: objectiveId } = req.params;

    const objective = await objectiveRepository.getById(sqlCon, objectiveId);

    const users = await userObjectiveShareRepository.findSharesByObjectiveId(sqlCon, objectiveId);

    return rep.code(HttpStatusCode.OK).send({
        objective: objective,
        users: users
    });
}
