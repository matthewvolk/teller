import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super({ name: 'InternalServerError', status: 500, message });
  }
}
