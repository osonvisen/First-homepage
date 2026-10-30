import { useId } from "react";

// The ØS monogram. Colours come from CSS variables, so the logo follows the theme.
// Geometry on a 100 × 100 grid: ring r=38.5, S curve inside, and the slash from Ø.
export function Logo({ title, className }: { title?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const left = "M50 14 A36 36 0 0 0 50 86 A18 18 0 0 0 50 50 A18 18 0 0 1 50 14 Z";
  const right = "M50 14 A36 36 0 0 1 50 86 A18 18 0 0 0 50 50 A18 18 0 0 1 50 14 Z";
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <clipPath id={`${id}-above`}><polygon points="-20,-20 120,-20 -20,120" /></clipPath>
        <clipPath id={`${id}-below`}><polygon points="120,-20 120,120 -20,120" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-above)`}>
        <path d={left} fill="var(--logo-a)" />
        <path d={right} fill="var(--logo-b)" />
      </g>
      <g clipPath={`url(#${id}-below)`}>
        <path d={left} fill="var(--logo-b)" />
        <path d={right} fill="var(--logo-a)" />
      </g>
      <line x1="22" y1="78" x2="78" y2="22" stroke="var(--logo-gap)" strokeWidth="6" strokeLinecap="round" />
      <path d="M63.39 17.66 A35 35 0 0 0 50 15 A17.5 17.5 0 0 0 50 50 A17.5 17.5 0 0 1 50 85 A35 35 0 0 1 36.61 82.34" fill="none" stroke="var(--logo-gap)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="38.5" fill="none" stroke="var(--logo-ring)" strokeWidth="5" />
      <line x1="16.64" y1="83.36" x2="83.36" y2="16.64" stroke="var(--logo-ring)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
