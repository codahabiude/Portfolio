import { ArrowUpRight, Heart } from 'lucide-react';
import { useRef, useState } from 'react';
import type { PortfolioProject } from '../types/portfolio.ts';

interface ProjectCardProps {
  project: PortfolioProject;
  featured?: boolean;
  onSelect: (project: PortfolioProject) => void;
}

export function ProjectCard({ project, featured = false, onSelect }: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    setTilt({
      rx,
      ry,
      gx: (x / rect.width) * 100,
      gy: (y / rect.height) * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${
          tilt.active ? 1.015 : 1
        })`,
      }}
      className={`group relative text-left rounded-2xl overflow-hidden bg-[#0c0e14] border border-white/12 hover:border-[var(--accent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        featured ? 'md:col-span-2 aspect-[16/10] md:aspect-[16/9]' : 'aspect-[4/3]'
      }`}
    >
      {!imgError ? (
        <img
          src={project.imageUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#0d121c,#141b29)]">
          <span className="font-display text-xl font-bold text-slate-400">
            {project.title}
          </span>
        </div>
      )}

      {/* Measured contrast scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/55 to-transparent" />

      {/* Dynamic pointer glare */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: tilt.active ? 0.35 : 0,
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.22), transparent 55%)`,
        }}
      />

      <div className="relative z-10 h-full p-6 flex flex-col justify-end">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="text-xs text-slate-300 font-medium">
            <span>{project.category}</span>
            <span className="mx-2 text-slate-500" aria-hidden="true">
              ·
            </span>
            <span className="font-mono">{project.year}</span>
          </p>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <Heart className="w-3.5 h-3.5 text-[var(--accent)]" />
            {project.appreciations}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-slate-300 mt-1 line-clamp-2">{project.subtitle}</p>
          </div>
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-full border border-white/20 bg-black/50 flex items-center justify-center text-white group-hover:bg-[var(--accent)] group-hover:text-[#050507] group-hover:border-transparent transition-colors shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
