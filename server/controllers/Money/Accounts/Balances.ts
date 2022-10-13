import { Request, Response, NextFunction } from 'express';

import { assertUserExists, authenticate } from '../../../middleware/authenticate';
import MoneyTokenService from '../../../services/MoneyTokenService';
import PlaidService, {
  AccountsGetRequest,
  CountryCode,
  InstitutionsGetByIdRequest,
} from '../../../services/PlaidService';

export const Balances = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertUserExists(req.user);

      const moneyTokens = await MoneyTokenService.getTokensForUser(req.user);

      const institutionPromises: ReturnType<
        typeof PlaidService.sandboxClient.institutionsGetById
      >[] = moneyTokens.map((token) => {
        const request: InstitutionsGetByIdRequest = {
          institution_id: token.institution,
          country_codes: [CountryCode.Us],
        };

        return new Promise((resolve) => {
          resolve(PlaidService.sandboxClient.institutionsGetById(request));
        });
      });

      const institutionResponses = await Promise.all(institutionPromises);

      const institutionData = institutionResponses.map((response) => response.data.institution);

      const balancePromises: ReturnType<typeof PlaidService.sandboxClient.accountsBalanceGet>[] =
        moneyTokens.map((token) => {
          const request: AccountsGetRequest = {
            access_token: token.access_token,
          };

          return new Promise((resolve) => {
            resolve(PlaidService.sandboxClient.accountsBalanceGet(request));
          });
        });

      const balanceResponses = await Promise.all(balancePromises);

      const balanceData = balanceResponses.map((response) => response.data.accounts);

      const balances = institutionData.map((institution, index) => ({
        id: institution.institution_id,
        name: institution.name,
        logo: institution.logo,
        url: institution.url,
        color: institution.primary_color,
        accounts: balanceData[index],
      }));

      res.json({ data: balances });
    } catch (err) {
      next(err);
    }
  },
];
