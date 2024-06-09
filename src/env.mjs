import * as z from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
});

export const env = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
});
