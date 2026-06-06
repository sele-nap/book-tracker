import type { NextFunction, Request, Response } from 'express';
import type { ZodIssue, ZodSchema } from 'zod';

function zodTypeToGedeon(issue: ZodIssue): string {
  if (issue.code === 'too_small') {
    const min = (issue as { minimum?: number }).minimum ?? 0;
    return min === 1 ? 'required' : `min-${min}`;
  }
  if (issue.code === 'too_big') {
    return `max-${(issue as { maximum?: number }).maximum ?? ''}`;
  }
  if (issue.code === 'invalid_type') {
    return (issue as { expected?: string }).expected !== undefined &&
      issue.message.includes('undefined')
      ? 'required'
      : 'invalid';
  }
  return 'invalid';
}

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        errors: result.error.issues.map((i) => ({
          id: i.path.join('.') || 'body',
          type: zodTypeToGedeon(i),
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
