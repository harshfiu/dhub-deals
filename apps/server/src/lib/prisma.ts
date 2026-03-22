// ============================================================
// src/lib/prisma.ts
// ============================================================
// Single shared Prisma Client instance.
// Mirrors the lib/ folder your colleague used in DealsVendor.
//
// Why singleton? ts-node-dev hot-reloads on every save.
// Without this, each reload opens a new DB connection and
// PostgreSQL hits its connection limit fast.
// ============================================================

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}