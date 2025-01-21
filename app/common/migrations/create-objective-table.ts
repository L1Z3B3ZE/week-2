import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("objectives")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("title", "varchar(127)", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("creatorid", "uuid", (col) => col.notNull().references("users.id").onDelete("cascade"))
        .addColumn("notifyAt", "timestamp")
        .addColumn("createdAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn("updatedAt", "timestamp", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn("isСompleted", "boolean", (col) => col.notNull().defaultTo(false))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("objectives").execute();
}
