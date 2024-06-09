import { pgTable, varchar } from "drizzle-orm/pg-core";

export const banks = pgTable("banks", {
  name: varchar("name", { length: 256 }),
});
