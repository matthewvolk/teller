import { NextFunction, Request, Response } from 'express';

import { authenticate } from '../../../../middleware/authenticate';
import PlaidService, {
  Products,
  SandboxPublicTokenCreateRequest,
} from '../../../../services/PlaidService';
import validators from '../../../../validators';

export const PublicToken = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { institution } = validators.http.RequestBody.Money.Auth.Sandbox.PublicToken.parse(
        req.body,
      );

      const publicTokenRequest: SandboxPublicTokenCreateRequest = {
        institution_id: institution,
        initial_products: [Products.Transactions],
      };

      const publicTokenResponse = await PlaidService.sandboxClient.sandboxPublicTokenCreate(
        publicTokenRequest,
      );

      res.json({ data: publicTokenResponse.data.public_token });
    } catch (err) {
      next(err);
    }
  },
];
