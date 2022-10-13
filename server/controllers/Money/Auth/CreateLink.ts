import { Request, Response, NextFunction } from 'express';

import { assertUserExists, authenticate } from '../../../middleware/authenticate';
import PlaidService, {
  CountryCode,
  LinkTokenCreateRequest,
  Products,
} from '../../../services/PlaidService';

export const CreateLink = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertUserExists(req.user);

      const request: LinkTokenCreateRequest = {
        user: {
          client_user_id: req.user.id.toString(),
          email_address: req.user.email,
        },
        client_name: 'Teller Connect',
        language: 'en',
        country_codes: [CountryCode.Us],
        products: [Products.Transactions],
      };

      const response = await PlaidService.sandboxClient.linkTokenCreate(request);

      res.json({ data: response.data });
    } catch (err) {
      next(err);
    }
  },
];
