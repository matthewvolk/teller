import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super({ name: 'BadRequestError', status: 400, message });
  }
}
