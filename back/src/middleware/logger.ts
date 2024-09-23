import { Request, Response, NextFunction, } from 'express';


// Middleware to verify token
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} accessed`);
  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  next(err);
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status);
  res.json([err.message, err.stack, err.status]).send();
}
export const successLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} success`);
  next();
}