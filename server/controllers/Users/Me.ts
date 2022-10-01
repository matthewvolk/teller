import { Request, Response, NextFunction } from 'express';

import { assertUserExists, authenticate } from '../../middleware/authenticate';

export const Me = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      assertUserExists(req.user);
      const user = req.user;

      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  },
];
