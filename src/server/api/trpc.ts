import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/server/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { getAuth } from "@clerk/nextjs/server";
import {
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

interface CreateContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

const createInnerTRPCContext = ({ auth }: CreateContextOptions) => {
  return {
    auth,
    prisma,
  };
};

export const createTRPCContext = ({ req }: CreateNextContextOptions) => {
  return createInnerTRPCContext({ auth: getAuth(req) });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const privateProcedure = t.procedure.use(enforceAuth);
