import { Request, Response, NextFunction } from 'express';

import postgres from '../../database';
import { User } from '../../models/User';
import JWTService from '../../services/JWTService';
import PasswordService from '../../services/PasswordService';

export const Register = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      const hashedPassword = await PasswordService.hashPassword(password);

      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.password = hashedPassword;

      const savedUser = await postgres.getRepository(User).save(user);

      const token = JWTService.signToken({ id: savedUser.id });

      res.json(token);
    } catch (err) {
      next(err);
    }
  },
];
