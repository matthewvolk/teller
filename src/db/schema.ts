import { varchar, pgTable, serial } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  accessToken: varchar("access_token").notNull(),
  itemId: varchar("item_id").notNull(),
});

export type SelectAccount = typeof accounts.$inferSelect;
