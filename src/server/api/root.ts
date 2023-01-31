import { plaidRouter } from "@/server/api/routers/plaid";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  plaid: plaidRouter,
});

export type AppRouter = typeof appRouter;
