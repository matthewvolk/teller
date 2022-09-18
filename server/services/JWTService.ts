import jwt from 'jsonwebtoken';

export interface JWTTokenPayload {
  id: number;
}

const JWTService = {
  signToken: (payload: JWTTokenPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET ?? 'secret', {
      expiresIn: process.env.JWT_EXPIRY,
    });
  },

  verifyToken: (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
  },
};

export default JWTService;
