// ============================================================
// src/controllers/auth.controller.ts
// ============================================================
// Handles all auth for DealsVendor:
//   POST /api/auth/signup  → create account
//   POST /api/auth/login   → get JWT
//   GET  /api/auth/me      → restore session on page refresh
// ============================================================

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest, SafeVendor } from '../types';

// ── Validation ─────────────────────────────────────────────

const signupSchema = z.object({
  email:          z.string().email('Please provide a valid email.'),
  password:       z.string().min(8, 'Password must be at least 8 characters.'),
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters.'),
  logoUrl:        z.string().url('Please provide a valid URL.').optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

// ── Helpers ────────────────────────────────────────────────

function createToken(vendorId: string): string {
  return jwt.sign({ vendorId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

function toSafeVendor(v: {
  id: string; email: string; restaurantName: string; logoUrl: string | null;
}): SafeVendor {
  return { id: v.id, email: v.email, restaurantName: v.restaurantName, logoUrl: v.logoUrl };
}

// ── POST /api/auth/signup ──────────────────────────────────
export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, restaurantName, logoUrl } = result.data;

    const existing = await prisma.vendor.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const vendor = await prisma.vendor.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10), // never store plain text
        restaurantName,
        logoUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token:  createToken(vendor.id),
      vendor: toSafeVendor(vendor),
    });
  } catch (error) {
    console.error('[auth] signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ── POST /api/auth/login ───────────────────────────────────
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = result.data;
    const vendor = await prisma.vendor.findUnique({ where: { email } });

    // Same error for wrong email or wrong password — prevents user enumeration
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token:  createToken(vendor.id),
      vendor: toSafeVendor(vendor),
    });
  } catch (error) {
    console.error('[auth] login:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ── GET /api/auth/me ───────────────────────────────────────
// Called by DealsVendor on every page load to restore the session.
// Requires: authenticate middleware
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const vendor = await prisma.vendor.findUnique({
      where:  { id: req.vendorId },
      select: { id: true, email: true, restaurantName: true, logoUrl: true },
    });

    if (!vendor) {
      res.status(404).json({ success: false, message: 'Vendor not found.' });
      return;
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error('[auth] getMe:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}