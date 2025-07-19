import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

function validatorHandler(schema: any, property: keyof Request) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = await req[property];
    const object = plainToInstance(schema, data, {
      enableImplicitConversion: true
    });

    validate(object)
      .then((errors) => {
        if (errors.length > 0) {
          const errorList = errors.map((error) => error.constraints);

          res.status(400).json({
            message: 'Validation failed',
            errors: errorList
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Internal server error',
          error: err.message
        });
      });
  };
}

export { validatorHandler };
