import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
});

const plaid = new PlaidApi(configuration);

/**
 * @todo Better error handling/messaging
 * @todo Plaid Link Update Mode: https://plaid.com/docs/link/update-mode/
 */
export const plaidRouter = createTRPCRouter({
  getAllAccounts: privateProcedure.query(async ({ ctx }) => {
    try {
      const items = await ctx.prisma.plaidItem.findMany({
        where: {
          userId: ctx.auth.userId,
        },
      });

      return Promise.all(
        items.map(async (item) => {
          const accounts = await plaid.accountsGet({
            access_token: item.accessToken,
          });

          return accounts.data;
        })
      );
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: JSON.stringify(err),
      });
    }
  }),
  createLinkToken: privateProcedure.query(async ({ ctx }) => {
    try {
      const linkTokenResponse = await plaid.linkTokenCreate({
        user: {
          client_user_id: ctx.auth.userId,
        },
        client_name: "Teller.sh",
        products: [Products.Auth],
        language: "en",
        country_codes: [CountryCode.Us],
      });

      return linkTokenResponse.data;
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: JSON.stringify(err),
      });
    }
  }),
  exchangePublicToken: privateProcedure
    .input(z.object({ publicToken: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await plaid.itemPublicTokenExchange({
          public_token: input.publicToken,
        });

        await ctx.prisma.plaidItem.create({
          data: {
            itemId: response.data.item_id,
            accessToken: response.data.access_token,
            userId: ctx.auth.userId,
          },
        });

        return true;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: JSON.stringify(err),
        });
      }
    }),
});
