import { NextFunction, Request, Response } from 'express';

import { authenticate, assertUserExists } from '../../middleware/authenticate';
import PlaidService, {
  AccountsGetRequest,
  Products,
  ItemPublicTokenExchangeRequest,
  SandboxPublicTokenCreateRequest,
} from '../../services/PlaidService';

export const Sandbox = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertUserExists(req.user);

      // 1 Call /link/token/create to create a link_token and pass the temporary token to your app's client.

      // ======= CLIENT =======
      const publicTokenRequest: SandboxPublicTokenCreateRequest = {
        institution_id: 'ins_109508',
        initial_products: [Products.Transactions],
      };

      const publicTokenResponse = await PlaidService.sandboxClient.sandboxPublicTokenCreate(
        publicTokenRequest,
      );
      // ======= CLIENT =======

      // 2 Use the link_token to open Link for your user. In the onSuccess callback, Link will provide a temporary public_token.
      const exchangeRequest: ItemPublicTokenExchangeRequest = {
        public_token: publicTokenResponse.data.public_token,
      };

      // 3 Call /item/public_token/exchange to exchange the public_token for a permanent access_token and item_id for the new Item.

      const exchangeResponse = await PlaidService.sandboxClient.itemPublicTokenExchange(
        exchangeRequest,
      );

      // 4 Store the access_token and use it to make product requests for your user's Item.

      const balanceRequest: AccountsGetRequest = {
        access_token: exchangeResponse.data.access_token,
      };

      const balanceResponse = await PlaidService.sandboxClient.accountsBalanceGet(balanceRequest);

      const accounts = balanceResponse.data.accounts;

      res.json({ data: accounts });
    } catch (err) {
      next(err);
    }
  },
];
