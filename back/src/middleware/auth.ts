import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import { config } from '../config.js';

const jwtSecret = config.server.jwtSecret ? config.server.jwtSecret : readFileSync('/run/secrets/jwt_secret', 'utf8').trim();

// Middleware to verify token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer token'

  if (!token) {
    return res.status(401).json({ error: 'Token is missing or invalid' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // If token is valid, attach user data to request and call next middleware
    req.user = user;
    next();
  });
};

export const authenticateTokenDownload = (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token.toString() || '';

  if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
      if (err) {
          return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      req.user = user; // Attach user info to the request
      next();
  });
};