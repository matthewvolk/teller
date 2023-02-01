import { plaidRouter } from "@/server/api/routers/plaid";
import { createTRPCRouter } from "@/server/api/trpc";
import { emailRouter } from "@/server/api/routers/email";

export const appRouter = createTRPCRouter({
  email: emailRouter,
  plaid: plaidRouter,
});

export type AppRouter = typeof appRouter;
