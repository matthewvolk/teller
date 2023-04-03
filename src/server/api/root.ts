import { createTRPCRouter } from "@/server/api/trpc";
import { plaidRouter } from "@/server/api/routers/plaid";

export const appRouter = createTRPCRouter({
  plaid: plaidRouter,
});

export type AppRouter = typeof appRouter;
