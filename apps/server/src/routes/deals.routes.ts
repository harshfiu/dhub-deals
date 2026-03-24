// ============================================================
// src/routes/deals.routes.ts
// ============================================================
// Mounted at /api/deals in src/index.ts
//
// Public routes  → called by DealsCustomer (no token needed)
// Protected routes → called by DealsVendor (JWT required)
// ============================================================

import { Router } from 'express';
import {
  getPublicDeals,
  getVendorDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  incrementViews,
  incrementClicks,
  incrementRedemptions,
  getDealStats,
} from '../controllers/deals.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// ── PUBLIC (no auth) — used by DealsCustomer ──────────────

// GET  /api/deals/public           → replaces DealsCustomer/src/data/deals.ts
router.get('/public', getPublicDeals);

// POST /api/deals/:id/stats/view   → call when DealCard becomes visible
// POST /api/deals/:id/stats/click  → call when user clicks "Get Deal"
// POST /api/deals/:id/stats/redeem → call when user redeems
router.post('/:id/stats/view',   incrementViews);
router.post('/:id/stats/click',  incrementClicks);
router.post('/:id/stats/redeem', incrementRedemptions);

// ── PROTECTED (JWT) — used by DealsVendor ─────────────────

// GET    /api/deals            → replaces DealsVendor/src/lib/mockData.ts
router.get('/',    authenticate, getVendorDeals);

// POST   /api/deals            → called from deals/new/page.tsx form
router.post('/',   authenticate, createDeal);

// GET    /api/deals/:id        → called from deals/[id]/edit page
router.get('/:id', authenticate, getDealById);

// PUT    /api/deals/:id        → called from edit deal form
router.put('/:id', authenticate, updateDeal);

// DELETE /api/deals/:id        → called from dashboard delete button
router.delete('/:id', authenticate, deleteDeal);

// GET    /api/deals/:id/stats  → called from dashboard analytics panel
router.get('/:id/stats', authenticate, getDealStats);

export default router;