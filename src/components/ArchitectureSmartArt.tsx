import { useState } from 'react';
import {
  KotlinMark,
  NextJsMark,
  NodeJsMark,
  ReactMark,
  ThreeJsMark,
  TypeScriptMark,
} from './BrandMarks.tsx';

interface SmartStage {
  id: string;
  step: string;
  title: string;
  summary: string;
  artifacts: string[];
  stackLabel: string;
}

const STAGES: SmartStage[] = [
  {
    id: 'blueprint',
    step: '01',
    title: 'Paper Coding & System Blueprint',
    summary:
      'Every project begins on paper—mapping state machines, data boundaries, and clear user stories before a single line of code is written.',
    artifacts: [
      'Entity & API contract diagrams',
      'User role & access flowcharts',
      'Performance and latency budgets',
    ],
    stackLabel: 'System Design · Wireframes · Docs',
  },
  {
    id: 'spatial',
    step: '02',
    title: '3D WebGL & Interface Architecture',
    summary:
      'Interactive Three.js scenes and accessible React design systems built with physical lighting, smooth damping, and crisp typography.',
    artifacts: [
      'Procedural Three.js PBR models',
      'Hardware-adaptive WebGL loops',
      'WCAG AA accessible component tokens',
    ],
    stackLabel: 'Three.js · React 19 · Tailwind CSS',
  },
  {
    id: 'fullstack',
    step: '03',
    title: 'Full-Stack & P2P Core Engineering',
    summary:
      'Typed Express and Next.js backends paired with Prisma databases—or hostless Kotlin peer-to-peer Wi-Fi Direct and WebRTC engines.',
    artifacts: [
      'Validated REST & Next.js server routes',
      'Offline-first mDNS & Wi-Fi Direct mesh',
      'Automated PDF, Excel & SMS pipelines',
    ],
    stackLabel: 'TypeScript · Node.js · Kotlin · Prisma',
  },
  {
    id: 'release',
    step: '04',
    title: 'Production Hardening & Launch',
    summary:
      'Containerized deployments, PWA and Capacitor Android packaging, and clean handover documentation built to scale reliably.',
    artifacts: [
      'Docker & Caddy TLS deployment',
      'PWA & Android APK release builds',
      'Zero-clutter documentation & handoff',
    ],
    stackLabel: 'Docker · Capacitor · GitHub',
  },
];

const CORE_STACK = [
  { name: 'TypeScript', Mark: TypeScriptMark },
  { name: 'React', Mark: ReactMark },
  { name: 'Three.js', Mark: ThreeJsMark },
  { name: 'Next.js', Mark: NextJsMark },
  { name: 'Kotlin', Mark: KotlinMark },
  { name: 'Node.js', Mark: NodeJsMark },
];

export function ArchitectureSmartArt() {
  const [activeId, setActiveId] = useState<string>(STAGES[0].id);
  const activeStage = STAGES.find((s) => s.id === activeId) ?? STAGES[0];

  return (
    <div className="mt-10 rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-6 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent)] mb-1">
            Interactive Craft Schematic
          </p>
          <h3 className="font-display text-2xl font-bold text-white">
            How Ideas Become Production Systems
          </h3>
        </div>
        <p className="font-mono text-xs text-slate-400">
          Select a stage to inspect workflow
        </p>
      </div>

      {/* Smart-Art Visual Flow Diagram */}
      <div className="relative">
        {/* Desktop SVG Connector Track */}
        <svg
          viewBox="0 0 1000 40"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="hidden lg:block w-full h-8 mb-2"
        >
          <line
            x1="125"
            y1="20"
            x2="875"
            y2="20"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <circle cx="125" cy="20" r="5" fill={activeId === 'blueprint' ? 'var(--accent)' : '#334155'} />
          <circle cx="375" cy="20" r="5" fill={activeId === 'spatial' ? 'var(--accent)' : '#334155'} />
          <circle cx="625" cy="20" r="5" fill={activeId === 'fullstack' ? 'var(--accent)' : '#334155'} />
          <circle cx="875" cy="20" r="5" fill={activeId === 'release' ? 'var(--accent)' : '#334155'} />
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const isSelected = stage.id === activeId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveId(stage.id)}
                className={`text-left rounded-xl p-4 border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  isSelected
                    ? 'bg-[#10141f] border-[var(--accent)] text-white'
                    : 'bg-[#06080d] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`font-mono text-xs ${
                      isSelected ? 'text-[var(--accent)]' : 'text-slate-500'
                    }`}
                  >
                    {stage.step}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      isSelected ? 'bg-[var(--accent)]' : 'bg-white/10'
                    }`}
                  />
                </div>
                <p className="font-display text-sm font-bold leading-snug">
                  {stage.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl bg-[#06080d] border border-white/10 p-5 sm:p-6">
        <div className="lg:col-span-7 space-y-2">
          <p className="font-mono text-xs text-[var(--accent)]">
            Stage {activeStage.step} · {activeStage.stackLabel}
          </p>
          <h4 className="font-display text-xl font-bold text-white">
            {activeStage.title}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{activeStage.summary}</p>
        </div>

        <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-6 flex flex-col justify-center">
          <p className="font-display text-xs font-semibold text-white mb-2.5">
            Key Outputs
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {activeStage.artifacts.map((artifact) => (
              <li key={artifact}>· {artifact}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Core Stack Visual Logos */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-4">Core Engineering Visual Stack</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CORE_STACK.map(({ name, Mark }) => (
            <div
              key={name}
              className="rounded-xl bg-[#06080d] border border-white/10 py-3.5 px-3 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-[var(--accent)] hover:text-white transition-colors"
            >
              <Mark className="w-7 h-7 text-[var(--accent)]" />
              <span className="font-mono text-[11px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
