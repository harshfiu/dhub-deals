// ============================================================
// src/middleware/auth.middleware.ts
// ============================================================
// Runs before any protected route.
// Reads the JWT from the Authorization header, verifies it,
// and attaches vendorId to the request object.
//
// Usage in routes:
//   router.get('/deals', authenticate, getVendorDeals)
// ============================================================

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types';

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // Header must be: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Please log in.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.vendorId = decoded.vendorId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}