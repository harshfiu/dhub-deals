// ============================================================
// src/index.ts — DHub Deals Server
// ============================================================
// Entry point. Wires middleware → routes → error handlers,
// then starts listening.
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes  from './routes/auth.routes';
import dealRoutes  from './routes/deals.routes';

// Must be called before any process.env reads
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────────────────
// Reads ALLOWED_ORIGINS from .env so both Next.js apps are
// allowed without hardcoding their ports.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow Postman/curl (no origin) + listed frontend URLs
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin '${origin}' is not allowed.`));
    },
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status:    'ok',
    service:   'dhub-server',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/deals', dealRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.path}' not found.`,
  });
});

// ── Global error handler ──────────────────────────────────
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
      ...(process.env.NODE_ENV === 'development' && { detail: err.message }),
    });
  }
);

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  dhub-server running`);
  console.log(`  http://localhost:${PORT}/health`);
  console.log(`  http://localhost:${PORT}/api/deals/public\n`);
});

export default app;