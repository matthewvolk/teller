import {
  type AccountBase,
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  type Transaction,
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
  accountsWithInstitution: privateProcedure.query(async ({ ctx }) => {
    try {
      const items = await ctx.prisma.plaidItem.findMany({
        where: {
          userId: ctx.auth.userId,
        },
      });

      const accounts = await Promise.all(
        items.map(async (item) => {
          const accounts = await plaid.accountsGet({
            access_token: item.accessToken,
          });

          return {
            institution_id: accounts.data.item.institution_id,
            accounts: accounts.data.accounts,
          };
        })
      );

      const institutionWithAccounts = await Promise.all(
        accounts.map(async (account) => {
          const institute = await plaid.institutionsGetById({
            institution_id: account.institution_id as string,
            country_codes: [CountryCode.Us],
          });

          return {
            institution_id: account.institution_id,
            institution_name: institute.data.institution.name,
            institution_color: institute.data.institution.primary_color,
            institution_url: institute.data.institution.url,
            institution_logo: institute.data.institution.logo,
            accounts: account.accounts,
          };
        })
      );

      type AccountsWithInstitution = Array<
        AccountBase & {
          institution_id: string | null | undefined;
          institution_name: string;
          institution_color: string | null | undefined;
          institution_url: string | null | undefined;
          institution_logo: string | null | undefined;
        }
      >;

      return institutionWithAccounts.reduce<AccountsWithInstitution>(
        (prev, curr) => {
          return [
            ...prev,
            ...curr.accounts
              .map((account) => ({
                ...account,
                institution_id: curr.institution_id,
                institution_name: curr.institution_name,
                institution_color: curr.institution_color,
                institution_url: curr.institution_url,
                institution_logo: curr.institution_logo,
              }))
              .flat(),
          ];
        },
        []
      );
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: JSON.stringify(err),
      });
    }
  }),
  transactions: privateProcedure
    .input(z.object({ start: z.string(), end: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const items = await ctx.prisma.plaidItem.findMany({
          where: {
            userId: ctx.auth.userId,
          },
        });

        const transactions = await Promise.all(
          items.map(async (item) => {
            const transactions = await plaid.transactionsGet({
              access_token: item.accessToken,
              start_date: input.start,
              end_date: input.end,
            });

            return transactions.data;
          })
        );

        const institutionWithTransactions = await Promise.all(
          transactions.map(async (transaction) => {
            const institute = await plaid.institutionsGetById({
              institution_id: transaction.item.institution_id as string,
              country_codes: [CountryCode.Us],
            });

            return {
              institution_id: transaction.item.institution_id,
              institution_name: institute.data.institution.name,
              institution_color: institute.data.institution.primary_color,
              institution_url: institute.data.institution.url,
              institution_logo: institute.data.institution.logo,
              accounts: transaction.accounts,
              transactions: transaction.transactions,
            };
          })
        );

        type TransactionsWithInstitution = Array<
          Transaction & {
            institution_id: string | null | undefined;
            institution_name: string;
            institution_color: string | null | undefined;
            institution_url: string | null | undefined;
            institution_logo: string | null | undefined;
            account_id: string;
            account_mask: string | null;
            account_name: string;
          }
        >;

        return institutionWithTransactions.reduce<TransactionsWithInstitution>(
          (prev, curr) => {
            return [
              ...prev,
              ...curr.transactions.map((transaction) => {
                const transactionAccount = curr.accounts.find(
                  (account) => account.account_id === transaction.account_id
                ) as AccountBase;

                return {
                  ...transaction,
                  institution_id: curr.institution_id,
                  institution_name: curr.institution_name,
                  institution_color: curr.institution_color,
                  institution_url: curr.institution_url,
                  institution_logo: curr.institution_logo,
                  account_id: transactionAccount.account_id,
                  account_mask: transactionAccount.mask,
                  account_name: transactionAccount.name,
                };
              }),
            ];
          },
          []
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
