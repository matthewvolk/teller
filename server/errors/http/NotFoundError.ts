import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super({ name: 'NotFoundError', status: 404, message });
  }
}
