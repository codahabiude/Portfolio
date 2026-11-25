import { ArrowUpRight, GitFork, Github, Heart, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PortfolioProject } from '../types/portfolio.ts';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onAppreciate: (projectId: string) => Promise<void>;
  onStartSimilar: (project: PortfolioProject) => void;
}

export function ProjectModal({
  project,
  onClose,
  onAppreciate,
  onStartSimilar,
}: ProjectModalProps) {
  const [imgError, setImgError] = useState(false);
  const [appreciating, setAppreciating] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const handleAppreciate = async () => {
    if (appreciating) return;
    setAppreciating(true);
    try {
      await onAppreciate(project.id);
    } finally {
      setAppreciating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] sm:aspect-[16/9] min-h-[210px] w-full bg-[#11141e] overflow-hidden">
          {!imgError ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(135deg,#0c121b,#141d2b)]">
              <span className="font-display text-2xl font-bold text-slate-300">
                {project.title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-black/35 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-2">
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{project.primaryLanguage}</span>
              <span aria-hidden="true">·</span>
              <span>{project.client}</span>
            </div>
            <h2 id="project-modal-title" className="font-display text-2xl sm:text-3xl font-bold text-white">
              {project.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">{project.subtitle}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-300">
              <span>{project.metrics}</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Star className="w-3.5 h-3.5" />
                {project.stars}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <GitFork className="w-3.5 h-3.5" />
                {project.forks}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAppreciate}
              disabled={appreciating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-xs font-semibold text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <Heart className="w-4 h-4 text-[var(--accent)]" />
              <span>Appreciate</span>
              <span className="font-mono">{project.appreciations}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-2">
                Overview
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">{project.summary}</p>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-2">
                Engineering Architecture
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">{project.architecture}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-2">
                Key Deliverables
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {project.deliverables.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-white mb-2">
                Core Stack
              </h3>
              <p className="font-mono text-xs leading-relaxed text-slate-300">
                {project.stack.join(' · ')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs text-slate-400 break-all sm:break-normal min-w-0">
              {project.views.toLocaleString()} views · github.com/codahabiude/{project.repoName}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-xs font-semibold text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" />
                <span>View Source Repo</span>
              </a>
              <button
                type="button"
                onClick={() => onStartSimilar(project)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[#050507] text-xs font-semibold hover:brightness-110 transition-all whitespace-nowrap shrink-0"
              >
                <span>Request Similar Build</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
