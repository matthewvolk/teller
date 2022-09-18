import Express from 'express';

import controllers from '../controllers';

const router = Express.Router();

router.get('/api/time', controllers.Time.Get);

router.post('/api/auth/register', controllers.Users.Register);
router.post('/api/auth/login', controllers.Users.Login);
router.get('/api/me', controllers.Users.Me);

export default router;
