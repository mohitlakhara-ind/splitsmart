import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config, logger } from '../config';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
  group?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.secretKey) as any;
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      res.status(401).json({ detail: 'User not found' });
      return;
    }
    
    req.user = user;
    next();
  } catch (err) {
    logger.warn(`JWT verification failed: ${err}`);
    res.status(401).json({ detail: 'Invalid token' });
  }
};
