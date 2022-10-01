import { Request, Response, NextFunction } from 'express';

import JWTService from '../../services/JWTService';
import UserService from '../../services/UserService';
import validators from '../../validators';

export const Register = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUserData = validators.http.RequestBody.Users.Register.parse(req.body);

      const savedUser = await UserService.saveNewUser(newUserData);
      const token = JWTService.signToken({ id: savedUser.id });

      res.json({ data: savedUser, token });
    } catch (err) {
      next(err);
    }
  },
];
