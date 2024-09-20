import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; username: string }; // Adjust this according to your JWT payload
    }
  }
}