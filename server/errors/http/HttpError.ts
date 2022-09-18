interface HttpErrorConstructor {
  name: string;
  status: number;
  message: string;
}

export class HttpError extends Error {
  name: string;
  status: number;

  constructor(config: HttpErrorConstructor) {
    super(config.message);

    this.name = config.name;
    this.status = config.status;

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (this as any).__proto__ = actualProto;
    }
  }
}
