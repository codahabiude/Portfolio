export type SectionId = 'home' | 'work' | 'services' | 'about' | 'hire';

export type ProjectCategory = 'All' | 'Full-Stack' | 'Mobile & P2P' | '3D Web';

export interface PortfolioProject {
  id: string;
  repoName: string;
  repoUrl: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  primaryLanguage: string;
  year: string;
  client: string;
  imageUrl: string;
  summary: string;
  architecture: string;
  stack: string[];
  metrics: string;
  deliverables: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  appreciations: number;
  views: number;
  featured?: boolean;
}

export interface ServiceItem {
  index: string;
  title: string;
  discipline: string;
  description: string;
  deliverables: string[];
  typicalTimeline: string;
}

export interface CapabilityMetric {
  label: string;
  proficiency: number;
  detail: string;
}

export interface PortfolioPayload {
  githubProfile: string;
  syncedAt: string | null;
  projects: PortfolioProject[];
  services: ServiceItem[];
  capabilities: CapabilityMetric[];
}

export interface InquiryPayload {
  name: string;
  email: string;
  service: string;
  timeline: string;
  details: string;
}

export interface InquirySubmissionResult {
  referenceId: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  submittedAt: string;
  estimatedResponse: string;
}

export interface InquiryStatusResponse {
  referenceId: string;
  status: 'Received' | 'Under Review' | 'Scheduled';
  service: string;
  submittedAt: string;
  estimatedResponse: string;
}

export type SceneSpeedMode = 'paused' | 'cruising' | 'hyper';
export type SceneSpectrumMode = 'section' | 'emerald' | 'cobalt';

export interface SceneControlState {
  explodeFactor: number;
  speedMode: SceneSpeedMode;
  spectrumMode: SceneSpectrumMode;
  wireframeOverlay: boolean;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  weekday: number;
}

export interface GitHubContributionsPayload {
  username: string;
  profileUrl: string;
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  fetchedAt: string;
  days: GitHubContributionDay[];
}

export const GITHUB_USER = 'codahabiude';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`;

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

export const FALLBACK_PROJECTS: PortfolioProject[] = [
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

export const FALLBACK_SERVICES: ServiceItem[] = [
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

export const FALLBACK_CAPABILITIES: CapabilityMetric[] = [
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

function inferRepoCategory(repo: GitHubRepoApiItem): PortfolioProject['category'] {
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

export function mergeGithubReposIntoProjects(
  baseProjects: PortfolioProject[],
  ghRepos: GitHubRepoApiItem[] | null
): PortfolioProject[] {
  if (!ghRepos || ghRepos.length === 0) return baseProjects;
  const ghByName = new Map(ghRepos.map((r) => [r.name.toLowerCase(), r]));

  const updated = baseProjects.map((proj) => {
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
      category: inferRepoCategory(repo),
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

export async function fetchBrowserGithubRepos(): Promise<GitHubRepoApiItem[] | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return null;
    return data.filter(
      (item): item is GitHubRepoApiItem =>
        Boolean(item && typeof item.name === 'string' && typeof item.html_url === 'string')
    );
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function buildContributionsPayloadFromDays(
  rawDays: Array<{ date: string; count: number; level: number }>,
  parsedHeaderTotal = 0
): GitHubContributionsPayload | null {
  if (rawDays.length === 0) return null;

  const dayMap = new Map<string, GitHubContributionDay>();
  for (const item of rawDays) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue;
    const levelNum = Math.max(0, Math.min(4, Math.round(Number(item.level) || 0)));
    const level = levelNum as 0 | 1 | 2 | 3 | 4;
    const count = Math.max(0, Math.round(Number(item.count) || 0));
    const weekday = new Date(`${item.date}T00:00:00Z`).getUTCDay();
    dayMap.set(item.date, { date: item.date, count, level, weekday });
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

export async function fetchBrowserGithubContributions(): Promise<GitHubContributionsPayload | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
      { signal: controller.signal }
    );
    if (res.ok) {
      const json = (await res.json()) as {
        total?: { lastYear?: number };
        contributions?: Array<{ date: string; count: number; level: number }>;
      };
      if (Array.isArray(json.contributions) && json.contributions.length > 0) {
        const parsed = buildContributionsPayloadFromDays(
          json.contributions,
          Number(json.total?.lastYear) || 0
        );
        if (parsed) return parsed;
      }
    }
  } catch {
    // Fall through to GitHub REST public events fallback
  } finally {
    window.clearTimeout(timeout);
  }

  const eventsController = new AbortController();
  const eventsTimeout = window.setTimeout(() => eventsController.abort(), 6000);
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: eventsController.signal,
      }
    );
    if (!res.ok) return null;
    const events = (await res.json()) as Array<{ created_at?: string }>;
    if (!Array.isArray(events)) return null;

    const countsByDate = new Map<string, number>();
    for (const ev of events) {
      const dateStr = ev.created_at?.slice(0, 10);
      if (dateStr) {
        countsByDate.set(dateStr, (countsByDate.get(dateStr) ?? 0) + 1);
      }
    }

    const days: Array<{ date: string; count: number; level: number }> = [];
    const end = new Date();
    end.setUTCHours(0, 0, 0, 0);
    for (let offset = 364; offset >= 0; offset--) {
      const d = new Date(end.getTime() - offset * 86_400_000);
      const iso = d.toISOString().slice(0, 10);
      const count = countsByDate.get(iso) ?? 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
      days.push({ date: iso, count, level });
    }
    return buildContributionsPayloadFromDays(days);
  } catch {
    return null;
  } finally {
    window.clearTimeout(eventsTimeout);
  }
}

