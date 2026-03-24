// ============================================================
// src/controllers/deals.controller.ts
// ============================================================
// Serves both frontend apps:
//
//  DealsCustomer (no auth needed)
//    GET  /api/deals/public          → all Active deals + vendor info
//    POST /api/deals/:id/stats/view  → track impressions
//    POST /api/deals/:id/stats/click → track clicks
//    POST /api/deals/:id/stats/redeem→ track redemptions
//
//  DealsVendor (JWT required)
//    GET    /api/deals           → vendor's own deals (all statuses)
//    POST   /api/deals           → create deal
//    GET    /api/deals/:id       → single deal
//    PUT    /api/deals/:id       → update deal
//    DELETE /api/deals/:id       → delete deal
//    GET    /api/deals/:id/stats → analytics
// ============================================================

import { Request, Response } from 'express';
import { z } from 'zod';
import { DealStatus, DiscountType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../types';

// ── Validation ─────────────────────────────────────────────

const dealSchema = z.object({
  title:         z.string().min(3, 'Title must be at least 3 characters.'),
  description:   z.string().min(10, 'Description must be at least 10 characters.'),
  terms:         z.string().optional(),
  discountType:  z.nativeEnum(DiscountType),
  discountValue: z.number().min(0),
  startDate:     z.string().datetime({ message: 'startDate must be ISO 8601, e.g. 2024-08-01T00:00:00.000Z' }),
  endDate:       z.string().datetime({ message: 'endDate must be ISO 8601.' }),
});

// ── Helper ─────────────────────────────────────────────────

// Recalculates status from real dates so it never goes stale.
function deriveStatus(start: Date, end: Date): DealStatus {
  const now = new Date();
  if (now < start) return DealStatus.Scheduled;
  if (now > end)   return DealStatus.Expired;
  return DealStatus.Active;
}

// ── PUBLIC ─────────────────────────────────────────────────

// GET /api/deals/public
// Used by DealsCustomer to replace the deals.ts mock data import.
export async function getPublicDeals(req: Request, res: Response): Promise<void> {
  try {
    const deals = await prisma.deal.findMany({
      where:   { status: DealStatus.Active },
      include: {
        // Includes restaurantName and logoUrl so DealCard.tsx can render them
        vendor: { select: { restaurantName: true, logoUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, count: deals.length, deals });
  } catch (error) {
    console.error('[deals] getPublicDeals:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ── VENDOR ─────────────────────────────────────────────────

// GET /api/deals
// Used by DealsVendor dashboard to replace mockData.ts.
export async function getVendorDeals(req: AuthRequest, res: Response): Promise<void> {
  try {
    const deals = await prisma.deal.findMany({
      where:   { vendorId: req.vendorId },
      orderBy: { createdAt: 'desc' },
    });

    // Sync status on every fetch (no cron job needed in development)
    const synced = await Promise.all(
      deals.map((deal) => {
        const current = deriveStatus(deal.startDate, deal.endDate);
        if (current === deal.status) return deal;
        return prisma.deal.update({ where: { id: deal.id }, data: { status: current } });
      })
    );

    res.status(200).json({ success: true, count: synced.length, deals: synced });
  } catch (error) {
    console.error('[deals] getVendorDeals:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// GET /api/deals/:id
export async function getDealById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });

    if (!deal) {
      res.status(404).json({ success: false, message: 'Deal not found.' });
      return;
    }
    if (deal.vendorId !== req.vendorId) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    res.status(200).json({ success: true, deal });
  } catch (error) {
    console.error('[deals] getDealById:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// POST /api/deals
// Called by DealsVendor → app/deals/new/page.tsx form submit
export async function createDeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = dealSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { startDate, endDate, ...rest } = result.data;
    const start = new Date(startDate);
    const end   = new Date(endDate);

    if (end <= start) {
      res.status(400).json({ success: false, message: 'End date must be after start date.' });
      return;
    }

    const deal = await prisma.deal.create({
      data: { ...rest, startDate: start, endDate: end, status: deriveStatus(start, end), vendorId: req.vendorId! },
    });

    res.status(201).json({ success: true, message: 'Deal created.', deal });
  } catch (error) {
    console.error('[deals] createDeal:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// PUT /api/deals/:id
// Called by DealsVendor dashboard edit form
export async function updateDeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const existing = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Deal not found.' });
      return;
    }
    if (existing.vendorId !== req.vendorId) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    const result = dealSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, message: 'Validation failed.', errors: result.error.flatten().fieldErrors });
      return;
    }

    const { startDate, endDate, ...rest } = result.data;
    const start = startDate ? new Date(startDate) : existing.startDate;
    const end   = endDate   ? new Date(endDate)   : existing.endDate;

    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data:  { ...rest, startDate: start, endDate: end, status: deriveStatus(start, end) },
    });

    res.status(200).json({ success: true, message: 'Deal updated.', deal });
  } catch (error) {
    console.error('[deals] updateDeal:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// DELETE /api/deals/:id
export async function deleteDeal(req: AuthRequest, res: Response): Promise<void> {
  try {
    const existing = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Deal not found.' });
      return;
    }
    if (existing.vendorId !== req.vendorId) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    await prisma.deal.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Deal deleted.' });
  } catch (error) {
    console.error('[deals] deleteDeal:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ── STATS (public — called from DealsCustomer) ─────────────

// POST /api/deals/:id/stats/view
export async function incrementViews(req: Request, res: Response): Promise<void> {
  await incrementStat(req, res, 'views');
}
// POST /api/deals/:id/stats/click
export async function incrementClicks(req: Request, res: Response): Promise<void> {
  await incrementStat(req, res, 'clicks');
}
// POST /api/deals/:id/stats/redeem
export async function incrementRedemptions(req: Request, res: Response): Promise<void> {
  await incrementStat(req, res, 'redemptions');
}

async function incrementStat(
  req: Request,
  res: Response,
  field: 'views' | 'clicks' | 'redemptions'
): Promise<void> {
  try {
    // { increment: 1 } is atomic — safe under concurrent requests
    const deal = await prisma.deal.update({
      where:  { id: req.params.id },
      data:   { [field]: { increment: 1 } },
      select: { id: true, views: true, clicks: true, redemptions: true },
    });
    res.status(200).json({ success: true, stats: deal });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Deal not found.' });
      return;
    }
    console.error(`[deals] increment ${field}:`, error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// GET /api/deals/:id/stats
// Used by DealsVendor analytics panel
export async function getDealStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const deal = await prisma.deal.findUnique({
      where:  { id: req.params.id },
      select: { id: true, vendorId: true, views: true, clicks: true, redemptions: true },
    });

    if (!deal) {
      res.status(404).json({ success: false, message: 'Deal not found.' });
      return;
    }
    if (deal.vendorId !== req.vendorId) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }

    res.status(200).json({ success: true, stats: deal });
  } catch (error) {
    console.error('[deals] getDealStats:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}