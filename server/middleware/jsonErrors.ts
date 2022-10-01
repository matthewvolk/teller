import { Request, Response, NextFunction } from 'express';

interface JsonError extends Error {
  status?: number;
}

const IS_PROD = process.env.NODE_ENV === 'heroku';

export const jsonErrors = (err: JsonError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: { ...err, message: err.message, ...(!IS_PROD && { stack: err.stack }) } });
};
