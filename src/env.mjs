import * as z from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  PLAID_CLIENT_ID: z.string(),
  PLAID_SANDBOX_API_SECRET: z.string(),
});

export const env = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SANDBOX_API_SECRET: process.env.PLAID_SANDBOX_API_SECRET,
});
