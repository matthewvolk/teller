import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { env } from "@/env/server.mjs";
import { TRPCError } from "@trpc/server";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { z } from "zod";

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_CLIENT_SECRET,
    },
  },
});

const plaid = new PlaidApi(plaidConfig);

export const plaidRouter = createTRPCRouter({
  createLinkToken: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    try {
      const createTokenResponse = await plaid.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: "Teller",
        products: [Products.Auth, Products.Transactions],
        language: "en",
        redirect_uri: "http://localhost:3000/dashboard",
        country_codes: [CountryCode.Us],
      });

      return createTokenResponse.data.link_token;
    } catch (error) {
      if (error instanceof Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to create link token",
      });
    }
  }),
  setAccessToken: protectedProcedure
    .input(z.object({ publicToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await plaid.itemPublicTokenExchange({
          public_token: input.publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        await ctx.prisma.plaidItem.upsert({
          where: {
            itemId,
          },
          update: {
            accessToken,
          },
          create: {
            accessToken,
            itemId,
            userId: ctx.session.user.id,
          },
        });

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to set access token",
        });
      }
    }),
  getAccountData: protectedProcedure.query(async ({ ctx }) => {
    const plaidItems = await ctx.prisma.plaidItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const accounts = await Promise.all(
      plaidItems.map(async (item) => {
        try {
          const response = await plaid.accountsGet({
            access_token: item.accessToken,
          });

          return response.data.accounts;
        } catch (error) {
          if (error instanceof Error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to get account data",
          });
        }
      })
    );

    return accounts.flat();
  }),
});
