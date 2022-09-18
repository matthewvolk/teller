import { Request, Response, NextFunction } from 'express';

import postgres from '../../database';
import { NotFoundError } from '../../errors';
import { User } from '../../models/User';
import JWTService from '../../services/JWTService';
import PasswordService from '../../services/PasswordService';

export const Login = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await postgres.getRepository(User).findOneBy({
        email,
      });

      if (!existingUser) {
        throw new NotFoundError('User not found in database');
      }

      await PasswordService.comparePasswords(password, existingUser.password);

      const token = JWTService.signToken({ id: existingUser.id });

      res.json(token);
    } catch (err) {
      next(err);
    }
  },
];
