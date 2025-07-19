import { Boom, isBoom } from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export function logErrors(
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log(err);
  next(err);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}

export function boomErrorHandler(
  err: Error | Boom,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (isBoom(err)) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}
