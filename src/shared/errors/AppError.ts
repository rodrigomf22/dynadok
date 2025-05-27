export class AppError extends Error {
    public readonly statusCode: number;
    public readonly name: string;
  
    constructor(message: string, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
  
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this);
    }
  }
  