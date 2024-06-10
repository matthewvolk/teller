import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
} from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull(),
  amount: numeric("amount", { scale: 2, precision: 10 }).notNull(),
  need: boolean("need").notNull(),
});
