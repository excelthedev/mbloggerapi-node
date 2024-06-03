import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const JWT_SECRET: any | string = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: any;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // console.log('Token from Header >>>>:', token);
  if (!token) {
    return res.status(401).json({ error: 'No Token Access Token Found, Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log('Decoded Toekn >>>', decoded);
    next();
  } catch (e) {
    // console.error('Token verification error >>', e);
    res.status(401).json({ error: 'Unauthorized Access' });
  }
};

export default auth;
