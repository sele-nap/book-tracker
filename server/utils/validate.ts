import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        errors: result.error.issues.map((i) => ({
          id: i.path.join('.') || 'body',
          type: 'invalid',
          message: i.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
