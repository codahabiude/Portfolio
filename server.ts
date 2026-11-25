import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import {
  cleanText,
  createInquiryRecord,
  ensureStore,
  fetchGithubContributions,
  getPortfolioPayload,
  isRateLimited,
  recordProjectAppreciation,
  recordProjectView,
  REF_ID_REGEX,
  validateInquiryInput,
} from './api/_lib/portfolioCore.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

function checkRateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.status(429).json({
      error: 'Too many project requests from this address. Please wait a few minutes.',
    });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  await ensureStore();

  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '32kb' }));

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.get('/api/portfolio', async (req, res) => {
    const forceSync = req.query.sync === '1';
    try {
      const payload = await getPortfolioPayload(forceSync);
      res.json(payload);
    } catch {
      res.status(500).json({ error: 'Unable to load portfolio catalog.' });
    }
  });

  app.get('/api/github/contributions', async (req, res) => {
    const forceSync = req.query.sync === '1';
    try {
      const payload = await fetchGithubContributions(forceSync);
      if (!payload) {
        res.status(502).json({
          error: 'Unable to fetch GitHub contribution calendar right now.',
        });
        return;
      }
      res.json(payload);
    } catch {
      res.status(500).json({ error: 'Failed to load GitHub contributions.' });
    }
  });

  app.post('/api/projects/:id/view', async (req, res) => {
    const projectId = cleanText(req.params.id, 64);
    if (!/^[a-z0-9-]+$/.test(projectId)) {
      res.status(400).json({ error: 'Invalid project identifier.' });
      return;
    }
    try {
      const updated = await recordProjectView(projectId);
      if (!updated) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Failed to record project view.' });
    }
  });

  app.post('/api/projects/:id/appreciate', async (req, res) => {
    const projectId = cleanText(req.params.id, 64);
    if (!/^[a-z0-9-]+$/.test(projectId)) {
      res.status(400).json({ error: 'Invalid project identifier.' });
      return;
    }
    try {
      const updated = await recordProjectAppreciation(projectId);
      if (!updated) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }
      res.json(updated);
    } catch {
      res.status(500).json({ error: 'Failed to save appreciation.' });
    }
  });

  app.post('/api/inquiries', checkRateLimit, async (req, res) => {
    const validated = validateInquiryInput(req.body);
    if ('error' in validated) {
      res.status(400).json({ error: validated.error });
      return;
    }
    try {
      const created = await createInquiryRecord(validated);
      res.status(201).json(created);
    } catch {
      res.status(500).json({ error: 'Unable to submit your inquiry right now.' });
    }
  });

  app.get('/api/inquiries/status/:refId', async (req, res) => {
    const refId = cleanText(req.params.refId, 32).toUpperCase();
    if (!REF_ID_REGEX.test(refId)) {
      res.status(400).json({
        error: 'Reference ID must match format REQ-2026-XXXXXX.',
      });
      return;
    }
    try {
      const store = await ensureStore();
      const found = store.inquiries.find((item) => item.referenceId === refId);
      if (!found) {
        res.status(404).json({ error: 'No inquiry found for that reference ID.' });
        return;
      }
      res.json({
        referenceId: found.referenceId,
        status: found.status,
        service: found.service,
        submittedAt: found.submittedAt,
        estimatedResponse: found.estimatedResponse,
      });
    } catch {
      res.status(500).json({ error: 'Unable to look up inquiry status.' });
    }
  });

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { maxAge: '1h' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Codah Abiude portfolio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
