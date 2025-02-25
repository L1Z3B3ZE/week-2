import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("user-objective-shares")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("userId", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("objectiveId", "uuid", (col) => col.notNull().references("objectives.id").onDelete("cascade"))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("user-objective-shares").execute();
}
