// ============================================================
// src/types/index.ts
// ============================================================
// Shared TypeScript types for the server.
// Mirrors the types/ folder pattern in DealsCustomer and
// DealsVendor (e.g. DealsCustomer/src/types/deal.ts).
// ============================================================

import { Request } from 'express';

// Extends Express Request with the authenticated vendor's ID.
// Populated by src/middleware/auth.middleware.ts after JWT check.
export interface AuthRequest extends Request {
  vendorId?: string;
}

// The data encoded inside every JWT token we issue
export interface JwtPayload {
  vendorId: string;
}

// Safe vendor shape returned to clients — password never included
export interface SafeVendor {
  id: string;
  email: string;
  restaurantName: string;
  logoUrl: string | null;
}