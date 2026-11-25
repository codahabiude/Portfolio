import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type {
  CapabilityMetric,
  GitHubContributionDay,
  GitHubContributionsPayload,
  PortfolioPayload,
  PortfolioProject,
  ServiceItem,
} from '../../src/types/portfolio';

export const GITHUB_USER = 'codahabiude';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`;

const IS_VERCEL = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
const DATA_DIR = IS_VERCEL
  ? path.join(os.tmpdir(), 'codah-portfolio-data')
  : path.resolve(process.cwd(), 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'portfolio-store.json');

export interface StoredInquiry {
  referenceId: string;
  name: string;
  email: string;
  service: string;
  timeline: string;
  details: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  submittedAt: string;
  estimatedResponse: string;
}

export interface PortfolioStore {
  projects: PortfolioProject[];
  inquiries: StoredInquiry[];
}

export interface GitHubRepoApiItem {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'nakoyonjo-admin-system',
    repoName: 'Nakoyonjo-Admin-System',
    repoUrl: 'https://github.com/codahabiude/Nakoyonjo-Admin-System',
    title: 'Nakoyonjo Admin System',
    subtitle: 'School Administration & Academic Operations Platform',
    category: 'Full-Stack',
    primaryLanguage: 'TypeScript',
    year: '2026',
    client: 'Nakoyonjo DEB Primary School · Bungoma, Kenya',
    imageUrl: '/src/assets/images/project_nakoyonjo_admin_1795608271960.jpg',
    summary:
      'A comprehensive school management system engineered for Nakoyonjo DEB Primary School. Supports role-based portals for Admins, Class Teachers, Subject Teachers, and Parents—handling student enrollment, exams and marks entry, class rankings, daily attendance registers, bulk PDF/Excel report cards, and SMS parent alerts via Africa’s Talking.',
    architecture:
      'Built on Next.js, TypeScript, Prisma ORM, and Tailwind CSS with PDFKit & ExcelJS document pipelines, PWA installability, Capacitor Android packaging, and Docker + Caddy deployment.',
    stack: ['TypeScript', 'Next.js', 'Prisma', 'Tailwind CSS', 'Capacitor', 'Docker'],
    metrics: '4 Role Portals · Bulk PDF & Excel Reports · PWA + Android APK',
    deliverables: [
      'Multi-Role RBAC (Admin, Teachers, Parent Portal)',
      'Exams, Grading Rules & Bulk Report Card Export',
      'Africa’s Talking SMS Delivery & Attendance Logs',
    ],
    stars: 0,
    forks: 0,
    updatedAt: '2026-11-23T11:25:46Z',
    appreciations: 14,
    views: 128,
    featured: true,
  },
  {
    id: 'lanvox',
    repoName: 'LanVox',
    repoUrl: 'https://github.com/codahabiude/LanVox',
    title: 'LanVox',
    subtitle: 'Offline Wi-Fi Direct & mDNS Mesh Communication App',
    category: 'Mobile & P2P',
    primaryLanguage: 'Kotlin',
    year: '2026',
    client: 'Android P2P Open Release',
    imageUrl: '/src/assets/images/project_lanvox_mesh_1795608272028.jpg',
    summary:
      'A peer-to-peer Android communication platform connecting multiple phones directly over Wi-Fi Direct (P2P) and local Wi-Fi / Mobile Hotspot mDNS mesh (NSD) without internet, router accounts, or a central server. Delivers 1:1 and multi-phone group messaging, read receipts, file sharing, WebRTC audio calling, and Camera2 video calling.',
    architecture:
      'Symmetric ChatServerService (port 8988) running on every handset with direct peer links, group broadcast routing, MID packet deduplication, and LocalMeshDiscovery (_lanvox._tcp.).',
    stack: ['Kotlin', 'Android SDK', 'Wi-Fi Direct', 'mDNS / NSD', 'WebRTC', 'Camera2'],
    metrics: 'Zero Central Server · Multi-Peer Mesh · Audio & Video Calls',
    deliverables: [
      'Hostless Wi-Fi Direct & Hotspot NSD Discovery',
      'Symmetric Group Mesh & File Transfer Engine',
      'WebRTC Voice & Camera2 Peer Video Calling',
    ],
    stars: 0,
    forks: 0,
    updatedAt: '2026-11-21T10:16:41Z',
    appreciations: 19,
    views: 164,
  },
  {
    id: 'portfolio',
    repoName: 'Portfolio',
    repoUrl: 'https://github.com/codahabiude/Portfolio',
    title: '3D Web Portfolio',
    subtitle: 'Futuristic Three.js & Full-Stack Showcase',
    category: '3D Web',
    primaryLanguage: 'TypeScript',
    year: '2026',
    client: 'codahabiude/Portfolio',
    imageUrl: '/src/assets/images/project_threejs_lab_1795527589083.jpg',
    summary:
      'An interactive 3D WebGL and full-stack engineering portfolio featuring a procedural 3D CA logo sphere, section-reactive camera choreography, live GitHub repository sync, GitHub contribution heatmap, and server-validated inquiry tracking.',
    architecture:
      'Hardware-adaptive Three.js WebGL 2 renderer with RoomEnvironment PBR reflections, zero-GC render loop, and serverless/Express TypeScript API endpoints.',
    stack: ['TypeScript', 'React 19', 'Three.js', 'Tailwind CSS', 'Express', 'Vite'],
    metrics: 'Adaptive WebGL 2 · Live GitHub Sync · <50ms API Target',
    deliverables: [
      'Procedural 3D CA Logo Sphere & Spatial Grid',
      'Live GitHub Repo & Contribution Heatmap Sync',
      'Rate-Limited Inquiry Persistence API',
    ],
    stars: 0,
    forks: 0,
    updatedAt: '2026-11-25T12:02:11Z',
    appreciations: 22,
    views: 210,
  },
];

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'Full-Stack Web Engineering',
    discipline: 'TypeScript · React · Next.js · Node.js',
    description:
      'End-to-end web applications engineered for speed, clarity, and maintainability—from multi-role management systems and Prisma databases to typed REST APIs.',
    deliverables: [
      'Production React, Next.js & TypeScript architecture',
      'Express / Node.js APIs with strict input validation',
      'PDF/Excel reporting & automated SMS notifications',
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
    title: 'Mobile & P2P Systems',
    discipline: 'Kotlin · Capacitor · WebRTC · UI/UX',
    description:
      'Offline-first Android apps, Capacitor hybrid builds, and clean user-centric interfaces bridging visual craft with resilient local networking.',
    deliverables: [
      'Native Kotlin Android & Capacitor mobile apps',
      'Peer-to-peer Wi-Fi Direct / WebRTC architecture',
      'WCAG AA accessible design systems',
    ],
    typicalTimeline: '2–4 Weeks',
  },
];

export const CAPABILITIES: CapabilityMetric[] = [
  {
    label: 'TypeScript, React & Next.js',
    proficiency: 90,
    detail: 'Full-stack web apps, Prisma ORM, Express APIs, Tailwind CSS',
  },
  {
    label: 'UI / UX & Design Systems',
    proficiency: 88,
    detail: 'Role-based portals, accessible flows, zero-clutter interfaces',
  },
  {
    label: 'Three.js / WebGL & Shaders',
    proficiency: 85,
    detail: 'PBR materials, procedural geometry, GLSL, hardware-adaptive loops',
  },
  {
    label: 'Kotlin Android & P2P Networking',
    proficiency: 84,
    detail: 'Wi-Fi Direct, mDNS NSD discovery, WebRTC voice & Camera2 video',
  },
];

const ALLOWED_SERVICES = new Set([
  'Full-Stack Web Engineering',
  '3D Web Experience',
  'UI/UX Design System',
  'Technical Consultation',
]);

const ALLOWED_TIMELINES = new Set([
  '2–4 Weeks',
  '1–2 Months',
  'Ongoing Collaboration',
  'Flexible',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const REF_ID_REGEX = /^REQ-2026-[A-F0-9]{6}$/;

let storeWriteQueue: Promise<void> = Promise.resolve();
const inquiryRateMap = new Map<string, number[]>();

let cachedGithubRepos: GitHubRepoApiItem[] | null = null;
let cachedGithubAt = 0;
let lastSyncIso: string | null = null;
let cachedContributions: GitHubContributionsPayload | null = null;
let cachedContributionsAt = 0;
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;

export function cleanText(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recent = (inquiryRateMap.get(ip) ?? []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 20) return true;
  recent.push(now);
  inquiryRateMap.set(ip, recent);
  return false;
}

export async function fetchLiveGithubRepos(
  force = false
): Promise<GitHubRepoApiItem[] | null> {
  const now = Date.now();
  if (!force && cachedGithubRepos && now - cachedGithubAt < GITHUB_CACHE_TTL_MS) {
    return cachedGithubRepos;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'codahabiude-portfolio-server',
      Accept: 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`,
      { headers, signal: controller.signal }
    );
    if (!res.ok) return cachedGithubRepos;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return cachedGithubRepos;
    cachedGithubRepos = data.filter(
      (item): item is GitHubRepoApiItem =>
        Boolean(item && typeof item.name === 'string' && typeof item.html_url === 'string')
    );
    cachedGithubAt = now;
    lastSyncIso = new Date().toISOString();
    return cachedGithubRepos;
  } catch {
    return cachedGithubRepos;
  } finally {
    clearTimeout(timeout);
  }
}

export function parseGithubContributionsHtml(
  html: string
): GitHubContributionsPayload | null {
  const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in the last year/i);
  const parsedHeaderTotal = totalMatch
    ? Number.parseInt(totalMatch[1].replace(/,/g, ''), 10)
    : 0;

  const cellRegex =
    /<td\b([^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*)>(?:\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>)?/gi;

  const dayMap = new Map<string, GitHubContributionDay>();
  let match: RegExpExecArray | null;
  while ((match = cellRegex.exec(html)) !== null) {
    const attrs = match[1];
    const dateStr = match[2];
    const tooltipText = (match[3] || '').trim();

    const levelMatch = attrs.match(/data-level="([0-4])"/i);
    const levelNum = levelMatch ? Number.parseInt(levelMatch[1], 10) : 0;
    const level = (levelNum >= 0 && levelNum <= 4 ? levelNum : 0) as 0 | 1 | 2 | 3 | 4;

    let count = 0;
    const countMatch = tooltipText.match(/^(\d+)\s+contribution/i);
    if (countMatch) {
      count = Number.parseInt(countMatch[1], 10);
    } else if (/^no contributions/i.test(tooltipText)) {
      count = 0;
    } else if (level > 0) {
      count = level;
    }

    const weekday = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
    dayMap.set(dateStr, { date: dateStr, count, level, weekday });
  }

  if (dayMap.size === 0) return null;

  const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  let activeDays = 0;
  let sumCounts = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    sumCounts += day.count;
    if (day.count > 0 || day.level > 0) {
      activeDays += 1;
      runningStreak += 1;
      if (runningStreak > longestStreak) longestStreak = runningStreak;
    } else {
      runningStreak = 0;
    }
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.date > todayIso) continue;
    if (d.count > 0 || d.level > 0) {
      currentStreak += 1;
    } else if (d.date === todayIso) {
      continue;
    } else {
      break;
    }
  }

  return {
    username: GITHUB_USER,
    profileUrl: GITHUB_PROFILE_URL,
    totalContributions: Math.max(parsedHeaderTotal, sumCounts),
    activeDays,
    longestStreak,
    currentStreak,
    fetchedAt: new Date().toISOString(),
    days,
  };
}

export async function fetchGithubContributions(
  force = false
): Promise<GitHubContributionsPayload | null> {
  const now = Date.now();
  if (!force && cachedContributions && now - cachedContributionsAt < GITHUB_CACHE_TTL_MS) {
    return cachedContributions;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: {
        'User-Agent': 'codahabiude-portfolio-server',
        Accept: 'text/html',
      },
      signal: controller.signal,
    });
    if (!res.ok) return cachedContributions;
    const html = await res.text();
    const parsed = parseGithubContributionsHtml(html);
    if (!parsed) return cachedContributions;
    cachedContributions = parsed;
    cachedContributionsAt = now;
    return parsed;
  } catch {
    return cachedContributions;
  } finally {
    clearTimeout(timeout);
  }
}

function inferCategory(repo: GitHubRepoApiItem): PortfolioProject['category'] {
  const lang = (repo.language || '').toLowerCase();
  const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
  if (text.includes('3d') || text.includes('three') || text.includes('portfolio')) {
    return '3D Web';
  }
  if (
    lang === 'kotlin' ||
    lang === 'swift' ||
    text.includes('android') ||
    text.includes('p2p')
  ) {
    return 'Mobile & P2P';
  }
  return 'Full-Stack';
}

export function mergeGithubIntoProjects(
  storedProjects: PortfolioProject[],
  ghRepos: GitHubRepoApiItem[] | null
): PortfolioProject[] {
  if (!ghRepos || ghRepos.length === 0) return storedProjects;
  const ghByName = new Map(ghRepos.map((r) => [r.name.toLowerCase(), r]));

  const updated = storedProjects.map((proj) => {
    const match = ghByName.get(proj.repoName.toLowerCase());
    if (!match) return proj;
    return {
      ...proj,
      repoUrl: match.html_url,
      primaryLanguage: match.language || proj.primaryLanguage,
      stars: match.stargazers_count,
      forks: match.forks_count,
      updatedAt: match.updated_at,
      year: match.updated_at ? match.updated_at.slice(0, 4) : proj.year,
    };
  });

  const knownNames = new Set(updated.map((p) => p.repoName.toLowerCase()));
  for (const repo of ghRepos) {
    if (repo.fork || knownNames.has(repo.name.toLowerCase())) continue;
    const slug = repo.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) continue;
    updated.push({
      id: slug,
      repoName: repo.name,
      repoUrl: repo.html_url,
      title: repo.name.replace(/[-_]+/g, ' '),
      subtitle:
        repo.description || `Open-source ${repo.language || 'software'} repository`,
      category: inferCategory(repo),
      primaryLanguage: repo.language || 'TypeScript',
      year: repo.updated_at ? repo.updated_at.slice(0, 4) : '2026',
      client: `github.com/${GITHUB_USER}`,
      imageUrl: '/src/assets/images/project_edge_commerce_1795527591292.jpg',
      summary:
        repo.description ||
        `Public repository ${repo.name} authored by Codah Abiude on GitHub.`,
      architecture: `Primary implementation in ${repo.language || 'modern web tooling'}, synchronized directly from github.com/${GITHUB_USER}/${repo.name}.`,
      stack: repo.language ? [repo.language, 'GitHub'] : ['GitHub'],
      metrics: `${repo.stargazers_count} stars · ${repo.forks_count} forks`,
      deliverables: ['Source Repository on GitHub', 'Documentation & Build Configuration'],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      appreciations: 1,
      views: 1,
    });
  }

  return updated;
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

export async function ensureStore(): Promise<PortfolioStore> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
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
    for (const item of parsed.projects ?? []) {
      if (!mergedProjects.some((p) => p.id === item.id)) {
        mergedProjects.push(item);
      }
    }
    return {
      projects: mergedProjects,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    const initial: PortfolioStore = {
      projects: INITIAL_PROJECTS.map((p) => ({ ...p })),
      inquiries: [],
    };
    try {
      await writeStoreAtomic(initial);
    } catch {
      // Ignore write failures in strict read-only runtimes
    }
    return initial;
  }
}

export function enqueueStoreMutation<T>(mutator: (store: PortfolioStore) => T): Promise<T> {
  const next = storeWriteQueue.then(async () => {
    const store = await ensureStore();
    const result = mutator(store);
    try {
      await writeStoreAtomic(store);
    } catch {
      // Non-fatal in ephemeral serverless sandboxes
    }
    return result;
  });
  storeWriteQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function getPortfolioPayload(forceSync = false): Promise<PortfolioPayload> {
  const [store, ghRepos] = await Promise.all([
    ensureStore(),
    fetchLiveGithubRepos(forceSync),
  ]);
  const projects = mergeGithubIntoProjects(store.projects, ghRepos);
  if (projects.length > store.projects.length) {
    await enqueueStoreMutation((latestStore) => {
      const existingIds = new Set(latestStore.projects.map((p) => p.id));
      for (const proj of projects) {
        if (!existingIds.has(proj.id)) {
          latestStore.projects.push(proj);
        }
      }
    });
  }
  return {
    githubProfile: GITHUB_PROFILE_URL,
    syncedAt: lastSyncIso,
    projects,
    services: SERVICES,
    capabilities: CAPABILITIES,
  };
}

export async function recordProjectView(
  projectId: string
): Promise<{ id: string; views: number } | null> {
  return enqueueStoreMutation((store) => {
    const project = store.projects.find((item) => item.id === projectId);
    if (!project) return null;
    project.views += 1;
    return { id: project.id, views: project.views };
  });
}

export async function recordProjectAppreciation(
  projectId: string
): Promise<{ id: string; appreciations: number } | null> {
  return enqueueStoreMutation((store) => {
    const project = store.projects.find((item) => item.id === projectId);
    if (!project) return null;
    project.appreciations += 1;
    return { id: project.id, appreciations: project.appreciations };
  });
}

export function validateInquiryInput(body: Record<string, unknown> | undefined) {
  const name = cleanText(body?.name, 80);
  const email = cleanText(body?.email, 120).toLowerCase();
  const service = cleanText(body?.service, 60);
  const timeline = cleanText(body?.timeline, 40);
  const details = cleanText(body?.details, 2000);

  if (name.length < 2) {
    return { error: 'Please provide your name (at least 2 characters).' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!ALLOWED_SERVICES.has(service)) {
    return { error: 'Please select a valid engagement scope.' };
  }
  if (!ALLOWED_TIMELINES.has(timeline)) {
    return { error: 'Please select a valid target timeline.' };
  }
  if (details.length < 10) {
    return {
      error: 'Please share at least 10 characters describing your project goals.',
    };
  }
  return { name, email, service, timeline, details };
}

export async function createInquiryRecord(input: {
  name: string;
  email: string;
  service: string;
  timeline: string;
  details: string;
}) {
  const referenceId = `REQ-2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const submittedAt = new Date().toISOString();
  const estimatedResponse = 'Within 24 hours (EAT / UTC+3)';

  const record: StoredInquiry = {
    referenceId,
    ...input,
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

  return {
    referenceId,
    status: record.status,
    submittedAt,
    estimatedResponse,
  };
}
