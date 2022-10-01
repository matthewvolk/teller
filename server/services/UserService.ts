import { z } from 'zod';

import postgres from '../database';
import { BadRequestError } from '../errors';
import { User } from '../models/User';
import validators from '../validators';

import PasswordService from './PasswordService';

type NewUserData = z.infer<typeof validators.http.RequestBody.Users.Register>;
type Credentials = z.infer<typeof validators.http.RequestBody.Users.Login>;

const UserService = {
  saveNewUser: async (newUserData: NewUserData) => {
    const user = new User();
    user.email = newUserData.email;
    user.first_name = newUserData.first_name;
    user.last_name = newUserData.last_name;

    const hashedPassword = await PasswordService.hashPassword(newUserData.password);
    user.password = hashedPassword;

    return postgres.getRepository(User).save(user);
  },

  logInUser: async (credentials: Credentials) => {
    const existingUser = await postgres.getRepository(User).findOneBy({
      email: credentials.email,
    });

    if (!existingUser) {
      throw new BadRequestError(`Requested user "${credentials.email}" not found in database`);
    }

    await PasswordService.comparePasswords(credentials.password, existingUser.password);

    return existingUser;
  },
};

export default UserService;
