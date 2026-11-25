import {
  ArrowRight,
  ArrowUp,
  RefreshCw,
  Send,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchitectureSmartArt } from './components/ArchitectureSmartArt.tsx';
import {
  CodahEmblemMark,
  CodahFullLogo,
  EmailLogo,
  FacebookLogo,
  GitHubLogo,
  InstagramLogo,
  LinkedInLogo,
  XLogo,
} from './components/BrandMarks.tsx';
import { GitHubContributionHeatmap } from './components/GitHubContributionHeatmap.tsx';
import { Navbar } from './components/Navbar.tsx';
import { ProjectCard } from './components/ProjectCard.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { ThreePortfolioScene } from './components/ThreePortfolioScene.tsx';
import type {
  CapabilityMetric,
  InquirySubmissionResult,
  PortfolioPayload,
  PortfolioProject,
  ProjectCategory,
  SceneControlState,
  SectionId,
  ServiceItem,
} from './types/portfolio.ts';

const SECTION_ACCENTS: Record<SectionId, string> = {
  home: '#00ff88',
  work: '#00ccff',
  services: '#a855f7',
  about: '#f59e0b',
  hire: '#ec4899',
};

const CATEGORIES: ProjectCategory[] = ['All', 'Full-Stack', 'Mobile & P2P', '3D Web'];

const SERVICE_OPTIONS = [
  'Full-Stack Web Engineering',
  '3D Web Experience',
  'UI/UX Design System',
  'Technical Consultation',
];

const TIMELINE_OPTIONS = [
  '2–4 Weeks',
  '1–2 Months',
  'Ongoing Collaboration',
  'Flexible',
];

const CONTACT_EMAIL = 'codahabiude@gmail.com';

const SOCIAL_CHANNELS = [
  {
    name: 'GitHub',
    handle: '@codahabiude',
    href: 'https://github.com/codahabiude',
    Logo: GitHubLogo,
    external: true,
  },
  {
    name: 'LinkedIn',
    handle: 'Codah Abiude',
    href: 'https://www.linkedin.com/in/codah-abiude-a67360447/',
    Logo: LinkedInLogo,
    external: true,
  },
  {
    name: 'X',
    handle: '@CodahAbiude',
    href: 'https://x.com/CodahAbiude',
    Logo: XLogo,
    external: true,
  },
  {
    name: 'Instagram',
    handle: '@codahabiude',
    href: 'https://www.instagram.com/codahabiude/',
    Logo: InstagramLogo,
    external: true,
  },
  {
    name: 'Facebook',
    handle: 'Codah Abiude',
    href: 'https://www.facebook.com/profile.php?id=61596615431262',
    Logo: FacebookLogo,
    external: true,
  },
  {
    name: 'Email',
    handle: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    Logo: EmailLogo,
    external: false,
  },
];

interface ToastItem {
  id: number;
  message: string;
  tone: 'success' | 'error';
}

const DEFAULT_SCENE_CONTROLS: SceneControlState = {
  explodeFactor: 0,
  speedMode: 'cruising',
  spectrumMode: 'section',
  wireframeOverlay: true,
};

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [capabilities, setCapabilities] = useState<CapabilityMetric[]>([]);
  const [githubProfile, setGithubProfile] = useState('https://github.com/codahabiude');
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [portraitError, setPortraitError] = useState(false);

  // Inquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<InquirySubmissionResult | null>(
    null
  );

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    home: null,
    work: null,
    services: null,
    about: null,
    hire: null,
  });

  const pushToast = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const loadPortfolio = useCallback(
    async (forceSync = false) => {
      if (forceSync) setSyncingGithub(true);
      else setLoadingPortfolio(true);
      setPortfolioError(null);
      try {
        const url = forceSync ? '/api/portfolio?sync=1' : '/api/portfolio';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Unable to load portfolio data');
        const data = (await res.json()) as PortfolioPayload;
        setProjects(data.projects);
        setServices(data.services);
        setCapabilities(data.capabilities);
        if (data.githubProfile) setGithubProfile(data.githubProfile);
        if (forceSync) pushToast('Synced repositories from github.com/codahabiude.');
      } catch {
        if (forceSync) {
          pushToast('GitHub sync could not reach api.github.com right now.', 'error');
        } else {
          setPortfolioError('Could not connect to portfolio API. Please retry.');
        }
      } finally {
        setLoadingPortfolio(false);
        setSyncingGithub(false);
      }
    },
    [pushToast]
  );

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  // Update CSS --accent token dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', SECTION_ACCENTS[activeSection]);
  }, [activeSection]);

  // Track active section on scroll + Scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 420);
      const triggerY = window.innerHeight * 0.35;
      const order: SectionId[] = ['home', 'work', 'services', 'about', 'hire'];
      let current: SectionId = 'home';
      for (const id of order) {
        const el = sectionRefs.current[id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection(section);
    const el = sectionRefs.current[section];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const handleSelectProject = async (project: PortfolioProject) => {
    setSelectedProject(project);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}/view`, {
        method: 'POST',
      });
      if (res.ok) {
        const updated = (await res.json()) as { id: string; views: number };
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, views: updated.views } : p))
        );
        setSelectedProject((prev) =>
          prev && prev.id === updated.id ? { ...prev, views: updated.views } : prev
        );
      }
    } catch {
      // Non-critical telemetry failure does not interrupt modal viewing
    }
  };

  const handleAppreciateProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/appreciate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Request failed');
      const updated = (await res.json()) as { id: string; appreciations: number };
      setProjects((prev) =>
        prev.map((p) =>
          p.id === updated.id ? { ...p, appreciations: updated.appreciations } : p
        )
      );
      setSelectedProject((prev) =>
        prev && prev.id === updated.id
          ? { ...prev, appreciations: updated.appreciations }
          : prev
      );
      pushToast('Appreciation recorded.');
    } catch {
      pushToast('Unable to save appreciation right now.', 'error');
    }
  };

  const handleStartSimilar = (project: PortfolioProject) => {
    setSelectedProject(null);
    setService(
      project.category === '3D Web' ? '3D Web Experience' : 'Full-Stack Web Engineering'
    );
    setDetails(
      `Interested in building a system similar to ${project.title} (${project.subtitle}).`
    );
    navigateTo('hire');
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, timeline, details }),
      });
      const payload = await res.json();
      if (!res.ok) {
        pushToast(payload.error || 'Please check your form details.', 'error');
        return;
      }
      const result = payload as InquirySubmissionResult;
      setSubmissionResult(result);
      setName('');
      setEmail('');
      setDetails('');
      pushToast(`Project request submitted (${result.referenceId}).`);
    } catch {
      pushToast('Network error submitting your inquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F2F4F8]">
      {/* Real-time Three.js 3D Viewport */}
      <ThreePortfolioScene activeSection={activeSection} controls={DEFAULT_SCENE_CONTROLS} />

      {/* Top Navigation */}
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-4 sm:right-8 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg border text-xs font-medium shadow-xl ${
              toast.tone === 'error'
                ? 'bg-[#1a0d12] border-rose-500/50 text-rose-200'
                : 'bg-[#0b0e14] border-[var(--accent)] text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-5 z-30 w-11 h-11 rounded-full bg-[#0b0d14] border border-white/20 text-white hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center transition-colors shadow-lg"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-8 pt-24 pb-20">
        {/* === HOME HERO SECTION === */}
        <section
          id="home"
          ref={(el) => {
            sectionRefs.current.home = el;
          }}
          className="pt-8 pb-16 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Editorial Hero Typography */}
            <div className="lg:col-span-7 flex flex-col justify-center bg-[#080a0f]/82 border border-white/10 rounded-2xl p-6 sm:p-10">
              <p className="text-xs font-medium text-slate-300 tracking-wide mb-4">
                <span>Creative Technologist</span>
                <span className="mx-2 text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span>Full-Stack &amp; 3D Web Engineer</span>
                <span className="mx-2 text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span>Kenya</span>
              </p>

              <h1
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02] mb-6"
                style={{ textWrap: 'balance' }}
              >
                Engineering Spatial Web &amp; Full-Stack Systems.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
                I am Codah Abiude—a creative technologist based in Kenya crafting bespoke
                digital ecosystems, hardware-accelerated Three.js experiences, and
                resilient TypeScript applications for forward-thinking enterprises.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('work')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-[#050507] text-sm font-semibold hover:brightness-110 transition-all whitespace-nowrap shrink-0"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('hire')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Start a Project</span>
                </button>
              </div>
            </div>

            {/* Right Column: Codah Abiude Portrait */}
            <div className="lg:col-span-5 flex">
              <div className="relative w-full min-h-[380px] lg:h-full rounded-2xl overflow-hidden bg-[#0c0e15] border border-white/15">
                {!portraitError ? (
                  <img
                    src="/assets/aistudio/codah-abiude-github_5146e819.jpg"
                    alt="Codah Abiude, Creative Technologist"
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#05060a]">
                    <CodahFullLogo className="p-4 rounded-2xl border border-white/15 bg-[#050507] shadow-[0_0_24px_rgba(0,255,136,0.2)]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-bold text-white">
                      Codah Abiude
                    </p>
                    <p className="text-xs text-slate-300">
                      Available for bespoke web &amp; 3D architecture
                    </p>
                  </div>
                  <div className="w-15 h-15 rounded-full bg-[#050507]/85 border border-white/20 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.28)] shrink-0">
                    <CodahEmblemMark className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Metric Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="rounded-xl bg-[#0a0c12]/90 border border-white/10 px-5 py-4">
              <p className="font-mono text-2xl font-medium text-white">90%</p>
              <p className="text-xs text-slate-400 mt-1">Frontend Architecture &amp; CSS</p>
            </div>
            <div className="rounded-xl bg-[#0a0c12]/90 border border-white/10 px-5 py-4">
              <p className="font-mono text-2xl font-medium text-white">85%</p>
              <p className="text-xs text-slate-400 mt-1">Three.js &amp; WebGL Shaders</p>
            </div>
            <div className="rounded-xl bg-[#0a0c12]/90 border border-white/10 px-5 py-4">
              <p className="font-mono text-2xl font-medium text-white">88%</p>
              <p className="text-xs text-slate-400 mt-1">UI/UX Systems &amp; Conversion</p>
            </div>
            <div className="rounded-xl bg-[#0a0c12]/90 border border-white/10 px-5 py-4">
              <p className="font-mono text-2xl font-medium text-[var(--accent)]">
                &lt; 50ms
              </p>
              <p className="text-xs text-slate-400 mt-1">Full-Stack API Response Target</p>
            </div>
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider */}
        <div
          aria-hidden="true"
          className="my-10 py-4 border-y border-white/10 bg-[#050507]/85 overflow-hidden"
        >
          <div className="animate-marquee">
            <span className="font-display text-lg sm:text-xl font-semibold tracking-wide text-slate-400 pr-12">
              Web Development · Immersive 3D · Full-Stack Engineering · UI/UX Systems ·
              Creative Strategy ·
            </span>
            <span className="font-display text-lg sm:text-xl font-semibold tracking-wide text-slate-400 pr-12">
              Web Development · Immersive 3D · Full-Stack Engineering · UI/UX Systems ·
              Creative Strategy ·
            </span>
          </div>
        </div>

        {/* === WORK SECTION === */}
        <section
          id="work"
          ref={(el) => {
            sectionRefs.current.work = el;
          }}
          className="py-16 scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium text-[var(--accent)] mb-2">
                GitHub Repositories · github.com/codahabiude
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Selected Works &amp; Open Repositories
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start">
              <div
                role="group"
                aria-label="Filter projects by discipline"
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#0b0d14] border border-white/12"
              >
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === category
                        ? 'bg-white text-[#050507]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => loadPortfolio(true)}
                disabled={syncingGithub}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0b0d14] border border-white/15 text-xs font-medium text-slate-200 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${syncingGithub ? 'animate-spin' : ''}`}
                />
                <span>{syncingGithub ? 'Syncing...' : 'Sync GitHub'}</span>
              </button>
            </div>
          </div>

          {loadingPortfolio ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`${
                    idx === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                  } rounded-2xl bg-[#0c0e15] border border-white/10 p-6 flex flex-col justify-end`}
                >
                  <div className="h-4 w-32 bg-white/10 rounded mb-3" />
                  <div className="h-6 w-56 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : portfolioError ? (
            <div className="rounded-2xl bg-[#0c0e15] border border-rose-500/30 p-8 text-center">
              <p className="text-sm text-rose-200 mb-4">{portfolioError}</p>
              <button
                type="button"
                onClick={() => loadPortfolio(false)}
                className="px-4 py-2 rounded-lg bg-white text-[#050507] text-xs font-semibold"
              >
                Retry Loading Works
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl bg-[#0c0e15] border border-white/10 p-8 text-center">
              <p className="text-sm text-slate-300">
                No projects match the selected filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured={selectedCategory === 'All' && index === 0}
                  onSelect={handleSelectProject}
                />
              ))}
            </div>
          )}
        </section>

        {/* === SERVICES SECTION === */}
        <section
          id="services"
          ref={(el) => {
            sectionRefs.current.services = el;
          }}
          className="py-16 scroll-mt-24 border-t border-white/10"
        >
          <div className="mb-10">
            <p className="text-xs font-medium text-[var(--accent)] mb-2">
              Capabilities
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Engineering &amp; Design Services
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((item) => (
              <article
                key={item.index}
                className="rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-7 flex flex-col justify-between hover:border-[var(--accent)] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="font-mono text-sm text-[var(--accent)]">
                      {item.index}.
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {item.typicalTimeline}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">{item.discipline}</p>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    {item.deliverables.map((del) => (
                      <li key={del}>· {del}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setService(
                        item.title.includes('3D')
                          ? '3D Web Experience'
                          : item.title.includes('Design')
                            ? 'UI/UX Design System'
                            : 'Full-Stack Web Engineering'
                      );
                      navigateTo('hire');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline"
                  >
                    <span>Book {item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* === ABOUT SECTION === */}
        <section
          id="about"
          ref={(el) => {
            sectionRefs.current.about = el;
          }}
          className="py-16 scroll-mt-24 border-t border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-6 rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-7 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <CodahFullLogo className="p-4 rounded-2xl border border-white/15 bg-[#050507] shadow-[0_0_24px_rgba(0,255,136,0.18)] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[var(--accent)] mb-2">About Me</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                    Precision Code Meets Clear Human Storytelling.
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                <p>
                  Hi, I&apos;m Codah Abiude—a creative technologist and full-stack web
                  developer from Kenya passionate about building clean, interactive web
                  experiences that balance engineering speed with visual craft.
                </p>
                <p>
                  I believe that being a great developer isn&apos;t just about talking to
                  computers—it&apos;s about clearly communicating ideas to people. When
                  I&apos;m not shipping TypeScript or WebGL shaders, I&apos;m sharpening
                  public speaking and &ldquo;paper coding&rdquo; system architectures in
                  my notebook.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <p className="font-display text-base font-semibold text-white">
                  &ldquo;Code is my craft, but communication is my bridge.&rdquo;
                </p>
                <span className="font-mono text-xs text-slate-400">
                  Nairobi · UTC+3
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-white mb-2">
                Core Technical Proficiencies
              </h3>
              {capabilities.map((cap) => (
                <div
                  key={cap.label}
                  className="rounded-xl bg-[#0a0c12]/92 border border-white/12 p-5"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-sm font-semibold text-white">{cap.label}</span>
                    <span className="font-mono text-sm text-[var(--accent)]">
                      {cap.proficiency}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
                      style={{ width: `${cap.proficiency}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{cap.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <GitHubContributionHeatmap />
          <ArchitectureSmartArt />
        </section>

        {/* === HIRE & COLLABORATION SECTION === */}
        <section
          id="hire"
          ref={(el) => {
            sectionRefs.current.hire = el;
          }}
          className="py-16 scroll-mt-24 border-t border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Personal Focus + Visual Social Channels */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-7 sm:p-9 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--accent)] mb-2">
                    Work With Codah Abiude
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                    Let&apos;s Build Something Impressive.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                    Whether you are launching a full-stack web platform, a peer-to-peer
                    mobile experience, or a Three.js interactive showcase, I collaborate
                    closely from first whiteboard sketch to production release.
                  </p>

                  <h3 className="font-display text-sm font-semibold text-white mb-4">
                    Connect Directly
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {SOCIAL_CHANNELS.map(({ name, handle, href, Logo, external }) => (
                      <a
                        key={name}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                        className="group rounded-xl bg-[#06080d] border border-white/12 p-3.5 flex items-center gap-3.5 hover:border-[var(--accent)] transition-colors"
                      >
                        <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#050507] transition-colors shrink-0">
                          <Logo className="w-5 h-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                            {name}
                          </span>
                          <span className="block font-mono text-xs text-slate-400 truncate">
                            {handle}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#06080d] border border-white/12 p-4">
                  <p className="font-mono text-xs text-[var(--accent)] mb-1">
                    Clarity-First Engineering
                  </p>
                  <p className="text-sm text-slate-300">
                    Before writing code, I map out user flows, API contracts, and
                    component architecture in plain language so every milestone stays
                    transparent.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Full-Stack Project Request Form */}
            <div className="lg:col-span-6 rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-7 sm:p-9">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Start a Project
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Submissions are validated and persisted directly via the portfolio API.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Name
                    </span>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Kimani"
                      className="w-full rounded-lg bg-[#05060a] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block">
                    <span className="block text-xs font-medium text-slate-300 mb-1.5">
                      Work Email
                    </span>
                    <input
                      type="email"
                      required
                      maxLength={120}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full rounded-lg bg-[#05060a] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-xs font-medium text-slate-300 mb-1.5">
                      Engagement Scope
                    </span>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full rounded-lg bg-[#05060a] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="block text-xs font-medium text-slate-300 mb-1.5">
                      Target Timeline
                    </span>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full rounded-lg bg-[#05060a] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]"
                    >
                      {TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Details
                  </span>
                  <textarea
                    rows={5}
                    required
                    minLength={10}
                    maxLength={2000}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Outline your product goals, target launch timeline, and key 3D or full-stack features..."
                    className="w-full rounded-lg bg-[#05060a] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-lg bg-[var(--accent)] text-[#050507] text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Request...' : 'Send Project Request'}</span>
                </button>
              </form>

              {submissionResult && (
                <div className="mt-6 rounded-xl bg-[#06090f] border border-[var(--accent)]/60 p-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">Inquiry Logged</span>
                    <span className="font-mono text-[var(--accent)]">
                      {submissionResult.referenceId}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Status: {submissionResult.status} · Expected reply:{' '}
                    {submissionResult.estimatedResponse}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <CodahEmblemMark className="w-10 h-10 shrink-0 drop-shadow-[0_0_12px_rgba(0,255,136,0.2)]" />
            <span>&copy; 2026 Codah Abiude · Built in Kenya</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {SOCIAL_CHANNELS.map(({ name, href, Logo, external }) => (
              <a
                key={name}
                href={name === 'GitHub' ? githubProfile : href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                aria-label={name}
                className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <Logo className="w-4 h-4" />
                <span>{name}</span>
              </a>
            ))}
          </div>
        </footer>
      </main>

      {/* Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAppreciate={handleAppreciateProject}
        onStartSimilar={handleStartSimilar}
      />
    </div>
  );
}
