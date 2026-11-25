import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SectionId } from '../types/portfolio.ts';
import { CodahEmblemMark } from './BrandMarks.tsx';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const NAV_LINKS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  const handleSelect = (section: SectionId) => {
    setMobileOpen(false);
    onNavigate(section);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-[#050507]/92 border-b border-white/10">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand wordmark + logo */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="inline-flex items-center gap-2.5 sm:gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        >
          <CodahEmblemMark className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-[0_0_12px_rgba(34,229,0,0.28)]" />
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
            Codah Abiude
          </span>
        </button>

        {/* Zone 2: 4 single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[2px] bg-[var(--accent)] transition-all duration-200 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('hire')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide rounded-lg bg-[var(--accent)] text-[#050507] hover:brightness-110 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Hire Me
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/15 text-slate-200 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#080a0f] border-b border-white/15 px-6 py-6 flex flex-col gap-3">
          {NAV_LINKS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-white/10 text-[var(--accent)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelect('hire')}
            className="mt-2 w-full py-3 px-4 rounded-lg bg-[var(--accent)] text-[#050507] font-semibold text-sm"
          >
            Hire Me
          </button>
        </div>
      )}
    </header>
  );
}
