import bcrypt from 'bcrypt';

import { UnauthorizedError } from '../errors';

const SALT_ROUNDS = process.env.PASSWORD_SALT_ROUNDS!;

const PasswordService = {
  hashPassword: (plaintextPw: string) => {
    return bcrypt.hash(plaintextPw, parseInt(SALT_ROUNDS));
  },

  comparePasswords: async (password: string, hash: string) => {
    const isValidPassword = await bcrypt.compare(password, hash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Incorrect password');
    }
  },
};

export default PasswordService;
