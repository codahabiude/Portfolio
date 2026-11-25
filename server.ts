import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import type {
  CapabilityMetric,
  PortfolioProject,
  ServiceItem,
} from './src/types/portfolio.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'portfolio-store.json');
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface StoredInquiry {
  referenceId: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  details: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  submittedAt: string;
  estimatedResponse: string;
}

interface PortfolioStore {
  projects: PortfolioProject[];
  inquiries: StoredInquiry[];
}

const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'neon-architects',
    title: 'Neon Architects',
    subtitle: 'Interactive 3D Architectural Pavilion',
    category: '3D Web',
    year: '2026',
    client: 'East Africa Spatial Studio',
    imageUrl: '/src/assets/images/project_neon_architects_1795527589172.jpg',
    summary:
      'A real-time WebGL architectural walkthrough allowing prospective buyers and architects to inspect structural concrete massing, linear lighting schematics, and time-of-day solar angles directly in the browser.',
    architecture:
      'Built on a modular Three.js PBR pipeline with RoomEnvironment IBL reflections, custom GLSL perimeter lighting, instanced structural louvers, and zero-GC camera damping.',
    stack: ['Three.js', 'TypeScript', 'GLSL', 'React 19', 'Tailwind CSS'],
    metrics: '60 FPS steady on desktop · 1.2s initial scene interactive',
    deliverables: [
      'Procedural PBR Pavilion Geometry',
      'Camera Preset Choreography',
      'Solar & Material Finish Configurator',
    ],
    appreciations: 48,
    views: 612,
    featured: true,
  },
  {
    id: 'void-data',
    title: 'Void Data',
    subtitle: 'Topographic Telemetry & Spatial Analytics',
    category: 'Systems UI',
    year: '2026',
    client: 'Nairobi Mobility Lab',
    imageUrl: '/src/assets/images/project_void_data_1795527589936.jpg',
    summary:
      'A high-contrast spatial telemetry dashboard rendering live elevation, density, and route-load terrain meshes with synchronized tabular metrics and sub-50ms stream updates.',
    architecture:
      'Combines a WebGL displaced heightfield mesh via onBeforeCompile with a Node.js streaming aggregation API and strict tabular-numeral readout architecture.',
    stack: ['React', 'Three.js Shaders', 'Express', 'WebSockets', 'TypeScript'],
    metrics: '18,400 live vertices · 38ms API round-trip latency',
    deliverables: [
      'Custom Terrain Displacement Shader',
      'Streaming Telemetry Backend',
      'Operator Control Dock UI',
    ],
    appreciations: 39,
    views: 495,
  },
  {
    id: 'threejs-experiments',
    title: 'Three.js Experiments',
    subtitle: 'Kinetic Optics & Procedural Art Lab',
    category: '3D Web',
    year: '2025',
    client: 'Independent Research',
    imageUrl: '/src/assets/images/project_threejs_lab_1795527589083.jpg',
    summary:
      'An ongoing series of mathematical WebGL studies exploring gyroscopic ring kinematics, physical anisotropy on brushed titanium, and optical glass dispersion.',
    architecture:
      'Hardware-adaptive rendering engine with automatic software-WebGL pacing, pre-allocated vector math pools, and procedural CanvasTexture normal maps.',
    stack: ['WebGL 2', 'Three.js', 'PMREM Lighting', 'Procedural Math'],
    metrics: '100% procedural geometry · Zero external asset dependencies',
    deliverables: [
      'Kinetic Gimbal Physics Solver',
      'Adaptive Software-GL Guard',
      'Interactive Shader Playground',
    ],
    appreciations: 64,
    views: 830,
  },
  {
    id: 'edge-commerce-core',
    title: 'Edge Commerce Core',
    subtitle: 'Full-Stack Order & M-Pesa Settlement Engine',
    category: 'Full-Stack',
    year: '2026',
    client: 'FinTech & Retail Infrastructure',
    imageUrl: '/src/assets/images/project_edge_commerce_1795527591292.jpg',
    summary:
      'A resilient full-stack API platform uniting real-time inventory synchronization, M-Pesa STK push webhook verification, and an ultra-clean operations console.',
    architecture:
      'TypeScript Express backend with idempotent transaction ledgers, strict payload schema validation, and optimistic React client state.',
    stack: ['Node.js', 'Express', 'TypeScript', 'React', 'REST APIs'],
    metrics: '99.98% settlement reliability · 42ms p95 API latency',
    deliverables: [
      'Idempotent Payment API',
      'Webhook Signature Verifier',
      'Real-Time Operations Console',
    ],
    appreciations: 52,
    views: 574,
  },
];

const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'Full-Stack Web Engineering',
    discipline: 'React · TypeScript · Node.js',
    description:
      'End-to-end web applications engineered for speed, clarity, and maintainability. Clean REST APIs, typed data contracts, and pixel-accurate responsive interfaces.',
    deliverables: [
      'Production React & TypeScript SPA architecture',
      'Express / Node.js APIs with strict validation',
      'Sub-second core web vitals optimization',
    ],
    typicalTimeline: '2–5 Weeks',
  },
  {
    index: '02',
    title: '3D Web Experiences',
    discipline: 'Three.js · WebGL · GLSL',
    description:
      'Interactive 3D product showcases, spatial storytelling, and custom procedural shaders that run smoothly across desktop GPUs and constrained mobile hardware.',
    deliverables: [
      'Procedural 3D models & PBR studio lighting',
      'Interactive camera choreography & raycasting',
      'Adaptive frame pacing for universal compatibility',
    ],
    typicalTimeline: '2–4 Weeks',
  },
  {
    index: '03',
    title: 'Design Systems & UI/UX',
    discipline: 'Architecture · Prototyping · Accessibility',
    description:
      'User-centric design systems bridging visual craft with engineering rigor. Clear typographic hierarchy, accessible contrast, and zero interface clutter.',
    deliverables: [
      'Tokenized color, spacing & type scales',
      'Interactive component libraries & state flows',
      'WCAG AA contrast & keyboard navigation audits',
    ],
    typicalTimeline: '1–3 Weeks',
  },
];

const CAPABILITIES: CapabilityMetric[] = [
  {
    label: 'HTML / CSS & Design Systems',
    proficiency: 90,
    detail: 'Semantic layout architecture, Tailwind CSS, responsive grids',
  },
  {
    label: 'UI / UX Engineering',
    proficiency: 88,
    detail: 'Accessible interaction flows, typographic precision, zero-clutter HUDs',
  },
  {
    label: 'Three.js / WebGL & Shaders',
    proficiency: 85,
    detail: 'PBR materials, procedural geometry, GLSL, hardware-adaptive loops',
  },
  {
    label: 'TypeScript & Full-Stack APIs',
    proficiency: 84,
    detail: 'React 19, Express, REST architecture, input validation & persistence',
  },
];

const ALLOWED_SERVICES = new Set([
  'Full-Stack Web Engineering',
  '3D Web Experience',
  'UI/UX Design System',
  'Technical Consultation',
]);

const ALLOWED_BUDGETS = new Set([
  '$500 – $1,500',
  '$1,500 – $4,000',
  '$4,000 – $10,000',
  '$10,000+',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REF_ID_REGEX = /^REQ-2026-[A-F0-9]{6}$/;

// In-memory store mutex & rate limiter
let storeWriteQueue: Promise<void> = Promise.resolve();
const inquiryRateMap = new Map<string, number[]>();

async function ensureStore(): Promise<PortfolioStore> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PortfolioStore>;
    const projectsById = new Map((parsed.projects ?? []).map((p) => [p.id, p]));
    const mergedProjects = INITIAL_PROJECTS.map((seed) => {
      const existing = projectsById.get(seed.id);
      if (!existing) return seed;
      return {
        ...seed,
        appreciations:
          typeof existing.appreciations === 'number'
            ? existing.appreciations
            : seed.appreciations,
        views: typeof existing.views === 'number' ? existing.views : seed.views,
      };
    });
    return {
      projects: mergedProjects,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    const initial: PortfolioStore = {
      projects: INITIAL_PROJECTS,
      inquiries: [],
    };
    await writeStoreAtomic(initial);
    return initial;
  }
}

async function writeStoreAtomic(store: PortfolioStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempPath = path.resolve(
    DATA_DIR,
    `portfolio-store.${crypto.randomBytes(6).toString('hex')}.tmp`
  );
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), 'utf-8');
  await fs.rename(tempPath, STORE_PATH);
}

function enqueueStoreMutation<T>(mutator: (store: PortfolioStore) => T): Promise<T> {
  const next = storeWriteQueue.then(async () => {
    const store = await ensureStore();
    const result = mutator(store);
    await writeStoreAtomic(store);
    return result;
  });
  storeWriteQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function checkRateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recent = (inquiryRateMap.get(ip) ?? []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 20) {
    res.status(429).json({
      error: 'Too many project requests from this address. Please wait a few minutes.',
    });
    return;
  }
  recent.push(now);
  inquiryRateMap.set(ip, recent);
  next();
}

function cleanText(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

async function startServer(): Promise<void> {
  await ensureStore();

  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '32kb' }));

  // Security headers compatible with iframe preview
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.get('/api/portfolio', async (_req, res) => {
    try {
      const store = await ensureStore();
      res.json({
        projects: store.projects,
        services: SERVICES,
        capabilities: CAPABILITIES,
      });
    } catch {
      res.status(500).json({ error: 'Unable to load portfolio catalog.' });
    }
  });

  app.post('/api/projects/:id/view', async (req, res) => {
    const projectId = cleanText(req.params.id, 64);
    if (!/^[a-z0-9-]+$/.test(projectId)) {
      res.status(400).json({ error: 'Invalid project identifier.' });
      return;
    }
    try {
      const updated = await enqueueStoreMutation((store) => {
        const project = store.projects.find((item) => item.id === projectId);
        if (!project) return null;
        project.views += 1;
        return { id: project.id, views: project.views };
      });
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
      const updated = await enqueueStoreMutation((store) => {
        const project = store.projects.find((item) => item.id === projectId);
        if (!project) return null;
        project.appreciations += 1;
        return { id: project.id, appreciations: project.appreciations };
      });
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
    const name = cleanText(req.body?.name, 80);
    const email = cleanText(req.body?.email, 120).toLowerCase();
    const service = cleanText(req.body?.service, 60);
    const budget = cleanText(req.body?.budget, 40);
    const details = cleanText(req.body?.details, 2000);

    if (name.length < 2) {
      res.status(400).json({ error: 'Please provide your name (at least 2 characters).' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!ALLOWED_SERVICES.has(service)) {
      res.status(400).json({ error: 'Please select a valid engagement scope.' });
      return;
    }
    if (!ALLOWED_BUDGETS.has(budget)) {
      res.status(400).json({ error: 'Please select a valid budget range.' });
      return;
    }
    if (details.length < 10) {
      res.status(400).json({
        error: 'Please share at least 10 characters describing your project goals.',
      });
      return;
    }

    const referenceId = `REQ-2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const submittedAt = new Date().toISOString();
    const estimatedResponse = 'Within 24 hours (EAT / UTC+3)';

    try {
      const record: StoredInquiry = {
        referenceId,
        name,
        email,
        service,
        budget,
        details,
        status: 'Received',
        submittedAt,
        estimatedResponse,
      };
      await enqueueStoreMutation((store) => {
        store.inquiries.unshift(record);
        if (store.inquiries.length > 500) {
          store.inquiries.length = 500;
        }
      });
      res.status(201).json({
        referenceId,
        status: record.status,
        submittedAt,
        estimatedResponse,
      });
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
      // Return status metadata only (never expose email/message PII on public lookup)
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
