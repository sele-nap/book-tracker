import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
