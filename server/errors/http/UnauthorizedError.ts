import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super({ name: 'UnauthorizedError', status: 401, message });
  }
}
