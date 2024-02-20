import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import * as z from "zod";

import { SelectItem } from "@/db/schema";

const PLAID_ENVIRONMENT = PlaidEnvironments.sandbox;

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_API_SECRET = process.env.PLAID_SANDBOX_API_SECRET;

const PLAID_API_VERSION = "2020-09-14";

const PLAID_PRODUCTS = [Products.Auth, Products.Transactions];
const PLAID_COUNTRY_CODES = [CountryCode.Us];
const PLAID_LANGUAGE = "en";

const TELLER_CLIENT_NAME = "teller";

const configuration = new Configuration({
  basePath: PLAID_ENVIRONMENT,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_API_SECRET,
      "Plaid-Version": PLAID_API_VERSION,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export const linkTokenCreate = async () => {
  const { data } = await plaidClient.linkTokenCreate({
    products: PLAID_PRODUCTS,
    client_name: TELLER_CLIENT_NAME,

    /**
     * @todo replace with actual user id
     */
    user: { client_user_id: "1" },
    language: PLAID_LANGUAGE,
    country_codes: PLAID_COUNTRY_CODES,
  });

  return z
    .object({
      linkToken: z.string(),
      expiration: z.string().transform((date) => new Date(date)),
      requestId: z.string(),
    })
    .parse({
      linkToken: data.link_token,
      expiration: data.expiration,
      requestId: data.request_id,
    });
};

export const itemPublicTokenExchange = async (publicToken: string) => {
  const { data } = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  return z
    .object({
      accessToken: z.string(),
      itemId: z.string(),
    })
    .parse({
      accessToken: data.access_token,
      itemId: data.item_id,
    });
};

export const accountsGet = async ({ accessToken }: SelectItem) => {
  if (!accessToken) {
    return null;
  }

  const response = await plaidClient.accountsGet({
    access_token: accessToken,
  });

  return response.data;
};

export const transactionsSync = async ({ accessToken }: SelectItem) => {
  if (!accessToken) {
    return null;
  }

  const response = await plaidClient.transactionsSync({
    access_token: accessToken,
  });

  return response.data;
};
