import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  SceneControlState,
  SceneSpectrumMode,
  SceneSpeedMode,
} from '../types/portfolio.ts';

interface ControlDockProps {
  controls: SceneControlState;
  onChange: (next: SceneControlState) => void;
}

const SPEED_OPTIONS: { value: SceneSpeedMode; label: string }[] = [
  { value: 'paused', label: 'Paused' },
  { value: 'cruising', label: 'Orbit' },
  { value: 'hyper', label: 'Hyper' },
];

const SPECTRUM_OPTIONS: { value: SceneSpectrumMode; label: string; dot: string }[] = [
  { value: 'section', label: 'Auto', dot: '#a855f7' },
  { value: 'emerald', label: 'Emerald', dot: '#00ff88' },
  { value: 'cobalt', label: 'Cobalt', dot: '#00ccff' },
];

export function ControlDock({ controls, onChange }: ControlDockProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <aside
      aria-label="3D Scene Controls"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(880px,94vw)] pointer-events-auto"
    >
      <div className="flex justify-center mb-1.5">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg bg-[#0c0e15] border border-b-0 border-white/15 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff88]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{collapsed ? 'Show 3D Controls (H)' : 'Hide 3D Controls (H)'}</span>
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="bg-[#0c0e15]/95 border border-white/15 rounded-xl px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 min-w-[190px] flex-1">
            <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
              Explode Core
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(controls.explodeFactor * 100)}
              onChange={(e) =>
                onChange({ ...controls, explodeFactor: Number(e.target.value) / 100 })
              }
              aria-label="Explode 3D core assembly"
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <span className="font-mono text-xs text-slate-300 w-9 text-right">
              {Math.round(controls.explodeFactor * 100)}%
            </span>
          </label>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...controls, speedMode: opt.value })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  controls.speedMode === opt.value
                    ? 'bg-white text-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            {SPECTRUM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...controls, spectrumMode: opt.value })}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  controls.spectrumMode === opt.value
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: opt.dot }}
                />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ ...controls, wireframeOverlay: !controls.wireframeOverlay })
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              controls.wireframeOverlay
                ? 'border-[var(--accent)] text-[var(--accent)] bg-white/5'
                : 'border-white/15 text-slate-300 hover:text-white'
            }`}
          >
            Lattice {controls.wireframeOverlay ? 'On' : 'Off'}
          </button>
        </div>
      )}
    </aside>
  );
}
