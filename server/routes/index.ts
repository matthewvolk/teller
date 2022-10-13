import Express from 'express';

import controllers from '../controllers';

const router = Express.Router();

router.get('/api/time', controllers.Time.Get);

router.post('/api/auth/register', controllers.Users.Register);
router.post('/api/auth/login', controllers.Users.Login);

router.get('/api/me', controllers.Users.Me);

router.post('/api/money/auth/sandbox/public_token', controllers.Money.Auth.Sandbox.PublicToken);
router.post('/api/money/auth/exchange_token', controllers.Money.Auth.ExchangeToken);
router.get('/api/money/accounts/balances', controllers.Money.Accounts.Balances);

export default router;
