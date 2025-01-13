import { Request, Response, NextFunction } from 'express';
import {JWT_SECRET} from '../config/environment.js';

import jwt from 'jsonwebtoken';

// Middleware to decode and verify JWT token
export const decodeJWTToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers['authorization'];
    
    // Extract token from the 'Authorization' header
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Token is not provided.',
        data: {
          error: 'Token is not provided.'
        }
      });
    }

    // Verify token with the secret key from environment variable
    jwt.verify(token, JWT_SECRET as string, (err, user) => {
      if (err) {
        // Invalid token
        return res.status(401).json({
          status: false,
          message: 'Token is invalid or expired.',
          data: {
          error: 'Token is invalid or expired.'

          }
        });
      }

      // Attach the user info (decoded payload) to the request object
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    });
  } catch (err) {
    console.error('Error verifying JWT:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error.',
      data: {
        error: err

      },
    });
  }
};
