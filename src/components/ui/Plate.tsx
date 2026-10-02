import type { ComponentType } from "react";
import type { Project } from "@/types/portfolio";
import { cn } from "@/lib/utils";

/**
 * Project plate artwork. midnight-glass calls for large, glowing plates — the
 * ink is light, the surface a translucent dark glass panel, and one element
 * in each plate carries the coral accent. Pure SVG, so they cost nothing to
 * load and stay crisp at any plate size. Hover glare is applied by the Tilt
 * wrapper at the plate level (a drop-shadow filter), not here.
 */

const ink = "currentColor";
const sheet = "var(--surface-2)";

function Ledger() {
  // Chained blocks with a private (accent) sub-tree — Canton's whole point.
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${40 + i * 150} 120)`}>
          <rect width="110" height="110" fill="none" stroke={ink} strokeWidth="2.5" />
          <rect x="16" y="16" width="78" height="20" fill={ink} opacity="0.28" />
          <rect x="16" y="46" width="52" height="8" fill={ink} opacity="0.45" />
          <rect x="16" y="64" width="66" height="8" fill={ink} opacity="0.45" />
        </g>
      ))}
      <path d="M150 175 H190 M300 175 H340" stroke={ink} strokeWidth="2.5" />
      <g transform="translate(190 285)">
        <rect width="110" height="70" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="7 5" />
        <path d="M55 -110 V0" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="7 5" />
        <circle cx="55" cy="35" r="10" fill="var(--accent)" />
      </g>
    </>
  );
}

function Grid() {
  // Multi-tenant workspaces: a dense grid, one cell lit.
  return (
    <>
      {Array.from({ length: 6 * 4 }).map((_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const lit = i === 8;
        return (
          <rect
            key={i}
            x={40 + col * 86}
            y={70 + row * 76}
            width="72"
            height="62"
            fill={lit ? "var(--accent)" : ink}
            opacity={lit ? 1 : 0.1 + ((i * 7) % 5) * 0.11}
            stroke={ink}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        );
      })}
    </>
  );
}

function Orbit() {
  // Three avatar modes circling one learner.
  return (
    <>
      <circle cx="280" cy="220" r="150" fill="none" stroke={ink} strokeWidth="2" strokeOpacity="0.55" />
      <circle cx="280" cy="220" r="96" fill="none" stroke={ink} strokeWidth="2" strokeOpacity="0.55" />
      <circle cx="280" cy="220" r="34" fill={ink} opacity="0.9" />
      <rect x="256" y="60" width="48" height="48" fill="none" stroke={ink} strokeWidth="2.5" />
      <circle cx="410" cy="300" r="24" fill="var(--accent)" />
      <path d="M126 300 l26 -46 26 46 z" fill="none" stroke={ink} strokeWidth="2.5" />
      <path d="M280 186 V108 M280 254 l108 34 M280 254 l-108 34" stroke={ink} strokeWidth="1.75" strokeOpacity="0.6" />
    </>
  );
}

function Stack() {
  // Scrape → generate → export: three offset sheets, the last one delivered.
  return (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={70 + i * 60}
          y={70 + i * 60}
          width="230"
          height="230"
          fill={i === 2 ? "var(--accent)" : sheet}
          stroke={i === 2 ? "var(--accent)" : ink}
          strokeWidth="2.5"
        />
      ))}
      <path d="M210 210 h150 M210 240 h110 M210 270 h132" stroke={ink} strokeWidth="2" strokeOpacity="0.55" />
      <path d="M330 330 l60 60 M390 390 h-34 M390 390 v-34" stroke="var(--accent)" strokeWidth="3" />
    </>
  );
}

function Mesh() {
  // Three runtimes, one contract between them.
  const nodes = [
    [110, 110],
    [430, 110],
    [270, 330],
  ] as const;
  return (
    <>
      <path d="M110 110 H430 M110 110 L270 330 M430 110 L270 330" stroke={ink} strokeWidth="2.5" />
      <circle cx="270" cy="185" r="30" fill="var(--accent)" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 42} y={y - 30} width="84" height="60" fill={sheet} stroke={ink} strokeWidth="2.5" />
          <rect x={x - 26} y={y - 12} width="52" height="6" fill={ink} opacity="0.55" />
          <rect x={x - 26} y={y + 2} width="34" height="6" fill={ink} opacity="0.55" />
        </g>
      ))}
    </>
  );
}

function Wave() {
  // A pattern library: the same form, restated seven times.
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M40 ${90 + i * 42} q 120 ${-40 - i * 6} 240 0 t 240 0`}
          fill="none"
          stroke={i === 3 ? "var(--accent)" : ink}
          strokeWidth={i === 3 ? 3.5 : 2}
          strokeOpacity={i === 3 ? 1 : 0.55}
        />
      ))}
    </>
  );
}

const artwork: Record<Project["plate"], ComponentType> = {
  ledger: Ledger,
  grid: Grid,
  orbit: Orbit,
  stack: Stack,
  mesh: Mesh,
  wave: Wave,
};

export function Plate({ variant, className }: { variant: Project["plate"]; className?: string }) {
  const Art = artwork[variant];
  return (
    // The observed element stays unclipped: a target clipped to zero width
    // has an empty intersection rect and never triggers its own reveal. The
    // wipe therefore lives on the inner layer.
    <div data-wipe className={cn("relative w-full overflow-hidden", className)}>
      <div className="h-full w-full rounded-[18px] bg-surface/50 text-ink">
        <svg
          viewBox="0 0 560 440"
          role="presentation"
          aria-hidden
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <Art />
        </svg>
      </div>
    </div>
  );
}
