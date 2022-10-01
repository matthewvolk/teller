import { Request, Response, NextFunction } from 'express';

import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import validators from '../../validators';

export const Login = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = validators.http.RequestBody.Users.Login.parse(req.body);

      const existingUser = await UserService.logInUser(credentials);
      const token = JWTService.signToken({ id: existingUser.id });

      res.json({ data: existingUser, token });
    } catch (err) {
      next(err);
    }
  },
];
