import postgres from '../database';
import { MoneyToken } from '../models/MoneyToken';
import { User } from '../models/User';

interface SaveTokenData {
  access_token: string;
  institution: string;
  item_id: string;
  user: User;
}

const MoneyTokenService = {
  saveToken: (saveTokenData: SaveTokenData) => {
    const moneyToken = new MoneyToken();
    moneyToken.access_token = saveTokenData.access_token;
    moneyToken.institution = saveTokenData.institution;
    moneyToken.item_id = saveTokenData.item_id;
    moneyToken.user = saveTokenData.user;

    return postgres.getRepository(MoneyToken).save(moneyToken);
  },

  getTokensForUser: (user: User) => {
    return postgres.getRepository(MoneyToken).find({
      relations: { user: true },
      where: {
        user: {
          id: user.id,
        },
      },
    });
  },
};

export default MoneyTokenService;
