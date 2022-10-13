import { NextFunction, Request, Response } from 'express';

import { InternalServerError } from '../../../errors';
import { assertUserExists, authenticate } from '../../../middleware/authenticate';
import MoneyTokenService from '../../../services/MoneyTokenService';
import PlaidService, {
  ItemGetRequest,
  ItemPublicTokenExchangeRequest,
} from '../../../services/PlaidService';
import validators from '../../../validators';

export const ExchangeToken = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertUserExists(req.user);

      const { public_token } = validators.http.RequestBody.Money.Auth.ExchangeToken.parse(req.body);

      const exchangeRequest: ItemPublicTokenExchangeRequest = {
        public_token,
      };

      const exchangeResponse = await PlaidService.sandboxClient.itemPublicTokenExchange(
        exchangeRequest,
      );

      const tokenMetaRequest: ItemGetRequest = {
        access_token: exchangeResponse.data.access_token,
      };

      const tokenMetaResponse = await PlaidService.sandboxClient.itemGet(tokenMetaRequest);

      const institution = tokenMetaResponse.data.item.institution_id;

      if (!institution) {
        throw new InternalServerError('Cannot save token because institution ID is null');
      }

      const savedToken = await MoneyTokenService.saveToken({
        access_token: exchangeResponse.data.access_token,
        institution,
        item_id: tokenMetaResponse.data.item.item_id,
        user: req.user,
      });

      res.json({ data: savedToken });
    } catch (err) {
      next(err);
    }
  },
];
