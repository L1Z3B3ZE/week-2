import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";
import { getAllObjectivesSchema } from "./schemas/get-all-objectives.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, schema: updateObjectiveSchema) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...schema, updatedAt: `now()` })
        .where("id", "=", id)
        .executeTakeFirst();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function getAll(con: Kysely<DB> | Transaction<DB>, userId: string, filters: getAllObjectivesSchema) {

    let query = con.selectFrom("objectives").selectAll().where("creatorid", "=", userId);

    query = query
        .$if(!!filters.search, (q) => q.where("title", "ilike", `%${filters.search as string}%`))
        .$if(typeof filters.isCompleted === "boolean", (q) => q.where("isCompleted", "=", filters.isCompleted as boolean))
        .$if(!!filters.sortTitle, (q) => q.orderBy("title", filters.sortTitle as "asc" | "desc"))
        .$if(!!filters.sortCreatedAt, (q) => q.orderBy("createdAt", filters.sortCreatedAt as "asc" | "desc"))
        .$if(!!filters.sortNotifyAt, (q) => q.orderBy("notifyAt", filters.sortNotifyAt as "asc" | "desc"))
        .$if(!!filters.limit, (q) => q.limit(filters.limit as number))
        .$if(!!filters.offset, (q) => q.offset(filters.offset as number));

    return await query.execute();
}
