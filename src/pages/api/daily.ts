import { env } from "@/env/server.mjs";
import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import Email from "@/email/daily";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const users = await prisma.user.findMany();

    const emails = [];

    for (const user of users) {
      const plaidItems = await prisma.plaidItem.findMany({
        where: {
          userId: user.id,
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
              throw new Error(error.message);
            }
            throw new Error("Unable to get account data");
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
        to: user.email as string,
        subject: `Your Daily Teller Update for ${new Date().toLocaleDateString()}`,
        html: emailHtml,
      };

      const email = await transporter.sendMail(options);
      const preview = nodemailer.getTestMessageUrl(email);

      console.log("Preview Email:", preview);

      emails.push(preview);
    }

    res.status(200).json({ emails });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
