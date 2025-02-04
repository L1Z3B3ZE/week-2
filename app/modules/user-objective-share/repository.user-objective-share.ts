import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, UserObjectiveShares } from "../../common/types/kysely/db.type";

export async function insert(con: Kysely<DB> | Transaction<DB>, entities: Insertable<UserObjectiveShares>[]) {
    return await con.insertInto("user-objective-shares").values(entities).execute();
}

export async function revoke(con: Kysely<DB> | Transaction<DB>, usersIds: string[], objectiveId: string) {
    return await con.deleteFrom("user-objective-shares").where("userId", "in", usersIds).where("objectiveId", "=", objectiveId).execute();
}

export async function findExistedAccess(con: Kysely<DB> | Transaction<DB>, usersIds: string[], objectiveId: string) {
    return await con.selectFrom("user-objective-shares").selectAll().where("userId", "in", usersIds).where("objectiveId", "=", objectiveId).execute();
}

export async function findSharesByObjectiveId(con: Kysely<DB> | Transaction<DB>, objectiveId: string) {
    return await con
        .selectFrom("user-objective-shares")
        .innerJoin("users", "users.id", "user-objective-shares.userId")
        .select(["users.id", "users.name", "users.login"])
        .where("user-objective-shares.objectiveId", "=", objectiveId)
        .execute();
}

export async function findShareByUserAndObjectiveIds(con: Kysely<DB> | Transaction<DB>, userId: string, objectiveId: string) {
    return await con.selectFrom("user-objective-shares").selectAll().where("userId", "=", userId).where("objectiveId", "=", objectiveId).executeTakeFirst();
}
