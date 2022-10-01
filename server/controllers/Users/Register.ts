import { Request, Response, NextFunction } from 'express';

import postgres from '../../database';
import { User } from '../../models/User';
import JWTService from '../../services/JWTService';
import PasswordService from '../../services/PasswordService';
import validators from '../../validators';

export const Register = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUserData = validators.http.RequestBody.Users.Register.parse(req.body);

      const hashedPassword = await PasswordService.hashPassword(newUserData.password);

      const user = new User();
      user.first_name = newUserData.first_name;
      user.last_name = newUserData.last_name;
      user.email = newUserData.email;
      user.password = hashedPassword;

      const savedUser = await postgres.getRepository(User).save(user);

      const token = JWTService.signToken({ id: savedUser.id });

      res.json({ data: savedUser, token });
    } catch (err) {
      next(err);
    }
  },
];
