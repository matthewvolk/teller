import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  accessToken: text("access_token"),
  itemId: text("item_id"),
});

export type SelectItem = typeof items.$inferSelect;
