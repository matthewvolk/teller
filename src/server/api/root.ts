import { createTRPCRouter } from "@/server/api/trpc";
import { helloRouter } from "@/server/api/routers/hello";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
