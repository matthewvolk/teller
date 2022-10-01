import { Request, Response, NextFunction } from 'express';

import postgres from '../../database';
import { NotFoundError } from '../../errors';
import { User } from '../../models/User';
import JWTService from '../../services/JWTService';
import PasswordService from '../../services/PasswordService';
import validators from '../../validators';

export const Login = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = validators.http.RequestBody.Users.Login.parse(req.body);

      const existingUser = await postgres.getRepository(User).findOneBy({
        email: credentials.email,
      });

      if (!existingUser) {
        throw new NotFoundError('User not found in database');
      }

      await PasswordService.comparePasswords(credentials.password, existingUser.password);

      const token = JWTService.signToken({ id: existingUser.id });

      res.json({ data: existingUser, token });
    } catch (err) {
      next(err);
    }
  },
];
