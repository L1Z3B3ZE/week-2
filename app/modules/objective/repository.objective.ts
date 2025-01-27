import { type Insertable, type Kysely, Transaction, type Updateable } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { getAllObjectivesSchema } from "./schemas/get-all-objectives.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, entity: Updateable<Objectives>) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...entity, updatedAt: `now()` })
        .where("id", "=", id)
        .executeTakeFirst();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function getAll(con: Kysely<DB> | Transaction<DB>, userId: string, filters: getAllObjectivesSchema) {
    let query = con.selectFrom("objectives").selectAll().where("creatorid", "=", userId);

    if (filters.search) {
        query = query.where("title", "ilike", `%${filters.search}%`);
    }

    if (typeof filters.isCompleted === "boolean") {
        query = query.where("isCompleted", "=", filters.isCompleted);
    }

    if (filters.sortBy && filters.sortOrder) {
        query = query.orderBy(filters.sortBy, filters.sortOrder);
    }

    query = query.limit(filters.limit).offset(filters.offset);

    return await query.execute();
}
