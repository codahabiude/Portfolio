import { useId, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function CodahEmblemMark(props: IconProps) {
  const uid = useId().replace(/:/g, '');
  const greenRingId = `ca-green-ring-${uid}`;
  const blueRingId = `ca-blue-ring-${uid}`;
  const chromeArcId = `ca-chrome-arc-${uid}`;
  const greenCId = `ca-green-c-${uid}`;
  const chromeAId = `ca-chrome-a-${uid}`;
  const spearTopId = `ca-spear-top-${uid}`;
  const spearBotId = `ca-spear-bot-${uid}`;
  const bgId = `ca-bg-${uid}`;

  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" {...props}>
      <defs>
        <radialGradient id={bgId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f1824" />
          <stop offset="72%" stopColor="#070a10" />
          <stop offset="100%" stopColor="#050507" />
        </radialGradient>
        <linearGradient id={greenRingId} x1="20" y1="30" x2="115" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a3ff33" />
          <stop offset="48%" stopColor="#22e500" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={blueRingId} x1="120" y1="210" x2="215" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="55%" stopColor="#00ccff" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id={chromeArcId} x1="100" y1="20" x2="210" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id={greenCId} x1="48" y1="62" x2="116" y2="176" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b4ff4d" />
          <stop offset="45%" stopColor="#22e500" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id={chromeAId} x1="108" y1="64" x2="168" y2="174" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="78%" stopColor="#475569" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id={spearTopId} x1="78" y1="115" x2="218" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id={spearBotId} x1="78" y1="125" x2="218" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="115" fill={`url(#${bgId})`} />

      <path
        d="M 28 124 A 92 92 0 0 1 132 29"
        stroke={`url(#${greenRingId})`}
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <path
        d="M 42 126 A 78 78 0 0 1 124 42"
        stroke="#86efac"
        strokeOpacity="0.65"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 136 29 A 92 92 0 0 1 208 98"
        stroke={`url(#${chromeArcId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M 122 212 A 92 92 0 0 1 30 132"
        stroke={`url(#${chromeArcId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d="M 209 135 A 92 92 0 0 1 128 212"
        stroke={`url(#${blueRingId})`}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 194 134 A 78 78 0 0 1 130 198"
        stroke="#7dd3fc"
        strokeOpacity="0.7"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <path
        d="M 123 64 L 99 64 C 66 64 46 88 46 120 C 46 152 66 176 99 176 L 114 176 L 122 153 L 101 153 C 80 153 69 140 69 120 C 69 100 80 87 101 87 L 115 87 L 123 64 Z"
        fill={`url(#${greenCId})`}
        stroke="#d9f99d"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M 118 71 L 100 71 C 72 71 55 92 55 120 C 55 148 72 169 100 169"
        stroke="#ecfccb"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        fillRule="evenodd"
        d="M 126 64 L 143 64 L 185 174 L 160 174 L 148 140 L 119 140 L 107 174 L 84 174 L 126 64 Z M 134.5 91 L 123 122 L 146 122 L 134.5 91 Z"
        fill={`url(#${chromeAId})`}
        stroke="#f8fafc"
        strokeOpacity="0.85"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <polygon points="78,120 174,108 218,117 174,122" fill={`url(#${spearTopId})`} />
      <polygon points="78,120 174,122 218,117 174,132" fill={`url(#${spearBotId})`} />
      <polyline
        points="78,120 174,108 218,117 174,132 78,120"
        stroke="#f8fafc"
        strokeOpacity="0.85"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodahFullLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <CodahEmblemMark className="w-24 h-24 sm:w-28 sm:h-28" />
      <div className="mt-2 font-display text-sm sm:text-base font-bold tracking-[0.18em] leading-none whitespace-nowrap">
        <span className="text-[#4dff33]">CODAH</span>{' '}
        <span className="text-[#00ccff]">ABIUDE</span>
      </div>
    </div>
  );
}

export function GitHubLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.64 3.01 8.57 7.18 9.96.52.1.71-.23.71-.5v-1.76c-2.92.63-3.54-1.41-3.54-1.41-.48-1.21-1.17-1.53-1.17-1.53-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.41-2.33-.26-4.78-1.17-4.78-5.19 0-1.15.41-2.09 1.08-2.82-.11-.27-.47-1.33.1-2.78 0 0 .88-.28 2.89 1.08a10.04 10.04 0 0 1 5.26 0c2.01-1.36 2.89-1.08 2.89-1.08.57 1.45.21 2.51.1 2.78.67.73 1.08 1.67 1.08 2.82 0 4.03-2.45 4.92-4.79 5.18.38.33.72.97.72 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 22.5 12c0-5.8-4.7-10.5-10.5-10.5Z" />
    </svg>
  );
}

export function LinkedInLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3ZM8.4 18.2H5.8V9.9h2.6v8.3ZM7.1 8.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11.1 9.4h-2.6v-4.1c0-.98-.02-2.24-1.36-2.24-1.37 0-1.58 1.07-1.58 2.17v4.17H10.1V9.9h2.5v1.13h.04c.35-.66 1.2-1.36 2.47-1.36 2.64 0 3.09 1.74 3.09 4v4.53Z" />
    </svg>
  );
}

export function InstagramLogo(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.29-.04-1.3-.14-2.47-.14-2.45 0-4.12 1.49-4.12 4.23v2.37H7.53v3.2h2.77V21h3.3Z" />
    </svg>
  );
}

export function XLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function EmailLogo(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function TypeScriptMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 14h8m-4 0v10.5M23.5 16.2c-.5-.8-1.4-1.2-2.6-1.2-1.5 0-2.5.8-2.5 2s.9 1.7 2.4 2.1l.9.2c1.2.3 1.9.9 1.9 2 0 1.4-1.1 2.3-2.9 2.3-1.4 0-2.5-.5-3.2-1.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReactMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="2.3" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="12" ry="4.8" stroke="currentColor" strokeWidth="1.6" />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.8"
        transform="rotate(60 16 16)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.8"
        transform="rotate(120 16 16)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function ThreeJsMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <polygon points="16,3 28,25 4,25" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <polygon points="16,11 22,22 10,22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="16" y1="3" x2="16" y2="11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function NextJsMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11.5 21V11l11 13.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20.5" y1="11" x2="20.5" y2="17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function KotlinMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <polygon
        points="5,5 27,5 16,16 27,27 5,27"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <line x1="5" y1="27" x2="27" y2="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function NodeJsMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <polygon
        points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12.5 19.5v-7l7 7v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
