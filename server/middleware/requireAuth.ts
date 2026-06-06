import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET!;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    res.status(401).send();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: unknown };
    if (
      typeof payload.sub !== 'string' ||
      !Types.ObjectId.isValid(payload.sub)
    ) {
      res.status(401).send();
      return;
    }
    req.userId = new Types.ObjectId(payload.sub);
    next();
  } catch {
    res.status(401).send();
  }
}
