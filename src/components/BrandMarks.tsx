import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

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
