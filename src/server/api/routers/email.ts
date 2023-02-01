import { protectedProcedure, createTRPCRouter } from "../trpc";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import Email from "@/email/daily";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { env } from "@/env/server.mjs";
import { TRPCError } from "@trpc/server";

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

export const emailRouter = createTRPCRouter({
  send: protectedProcedure.mutation(async ({ ctx }) => {
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

    const accountsFlat = accounts.flat();

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const emailHtml = render(Email({ accounts: accountsFlat }));

    const options = {
      from: "Teller <goodmorning@teller.sh>",
      to: ctx.session.user.email as string,
      subject: `Your Daily Teller Update for ${new Date().toLocaleDateString()}`,
      html: emailHtml,
    };

    const email = await transporter.sendMail(options);
    const preview = nodemailer.getTestMessageUrl(email);

    console.log("Preview Email:", preview);

    return preview;
  }),
});
