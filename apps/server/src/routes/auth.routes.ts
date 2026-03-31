// ============================================================
// src/routes/auth.routes.ts
// ============================================================
// Mounted at /api/auth in src/index.ts
// ============================================================

import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/signup  → register a new vendor (DealsVendor sign up page)
router.post('/signup', signup);

// POST /api/auth/login   → authenticate and receive JWT (DealsVendor login page)
router.post('/login', login);

// GET  /api/auth/me      → get current vendor profile (session restore on refresh)
router.get('/me', authenticate, getMe);

export default router;