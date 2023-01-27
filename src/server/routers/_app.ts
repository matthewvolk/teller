import { z } from 'zod';
import { procedure, router } from '../trpc';

import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaid = new PlaidApi(plaidConfig);

export const appRouter = router({
  linkToken: procedure.query(async () => {
    try {
      const createTokenResponse = await plaid.linkTokenCreate({
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: '1',
        },
        client_name: 'Plaid Test App',
        products: [Products.Auth],
        language: 'en',
        webhook: 'https://webhook.example.com',
        redirect_uri: 'http://localhost:3000/',
        country_codes: [CountryCode.Us],
      });

      return createTokenResponse.data;
    } catch (error) {
      console.error(error);
    }
  }),
});

export type AppRouter = typeof appRouter;
