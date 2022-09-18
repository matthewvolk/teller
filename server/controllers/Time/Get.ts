import { Request, Response, NextFunction } from 'express';

export const Get = [
  (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ time: new Date() });
    } catch (err) {
      next(err);
    }
  },
];
