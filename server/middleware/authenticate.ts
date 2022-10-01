import { NextFunction, Request, Response } from 'express';

import postgres from '../database';
import { InternalServerError, UnauthorizedError } from '../errors';
import { User } from '../models/User';
import JWTService, { JWTTokenPayload } from '../services/JWTService';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Expecting: Authorization: Bearer TOKEN header
    const { authorization } = req.headers;

    // Check that Authorization: Bearer TOKEN header is present
    if (!authorization) {
      throw new UnauthorizedError(
        'Missing authorization header (Bearer: token) in request headers',
      );
    }

    // Split the token from the authorization header
    const token = authorization.split(' ')[1];

    // Check if token is malformed
    if (!token) {
      throw new UnauthorizedError('Malformed token');
    }

    // Verify token
    const verifiedToken = JWTService.verifyToken(token) as JWTTokenPayload;

    /**
     * @todo figure out what would cause this error
     *
     * For some reason, the return value of jwt.verify is:
     * string | jwt.JwtPayload
     * However, I would always expect to just receive jwt.JwtPayload,
     * and I'm not entirely sure what would cause a string to return.
     *
     * The below check is only for type checking
     */
    if (typeof verifiedToken === 'string') {
      throw new InternalServerError('Internal server error while decoding JWT');
    }

    // Retrieve user associated with token ID from database
    const userRepository = postgres.getRepository(User);
    const user = await userRepository.findOneBy({
      id: verifiedToken.id,
    });

    // Handle user not found
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

export function assertUserExists(user?: User): asserts user is User {
  if (!(user instanceof User)) {
    throw new UnauthorizedError('User does not exist');
  }
}
