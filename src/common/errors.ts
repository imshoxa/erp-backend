export class AppError extends Error {
    constructor(
      public readonly error_code: string,
      message: string,
      public readonly field?: string,
      public readonly statusCode: number = 400
    ) {
      super(message);
    }
  }
  
  