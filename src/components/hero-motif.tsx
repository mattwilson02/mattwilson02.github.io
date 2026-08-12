/**
 * Hero motif — decorative, purely presentational.
 *
 * A grid of cells that resolves left-to-right: hairline outlines on one side,
 * solid filled blocks on the other. It's the positioning as a graphic — the
 * part-built thing becoming the finished one — rather than texture for its
 * own sake. Deliberately not a particle field; that's the stock look of every
 * AI agency page and the exact thing this site is positioned against.
 *
 * Pure inline SVG. No dependencies, no images, no runtime cost. Delete this
 * component and the one line rendering it in hero.tsx to remove entirely.
 */

const COLS = 14;
const ROWS = 7;
const CELL = 26;
const GAP = 6;

export function HeroMotif() {
  const cells = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // Progress across the grid, 0 → 1
      const t = col / (COLS - 1);

      // Deterministic pseudo-randomness — no Math.random, so server and client
      // render identically and hydration stays clean.
      const jitter = ((row * 7 + col * 13) % 10) / 10;

      // Cells resolve from outline to solid as they move right
      const solid = t > 0.45 + jitter * 0.45;
      const visible = t > 0.08 + jitter * 0.25;

      if (!visible) continue;

      cells.push(
        <rect
          key={`${row}-${col}`}
          x={col * (CELL + GAP)}
          y={row * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx={3}
          fill={solid ? "var(--color-accent)" : "none"}
          stroke={solid ? "none" : "var(--color-border)"}
          strokeWidth={1}
          strokeDasharray={solid ? undefined : "3 3"}
          opacity={solid ? 0.1 + t * 0.28 : 0.5}
        />,
      );
    }
  }

  const width = COLS * (CELL + GAP) - GAP;
  const height = ROWS * (CELL + GAP) - GAP;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 select-none lg:block"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          {/* Fades the left edge out so the grid emerges rather than starting abruptly */}
          <linearGradient id="motif-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="45%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="motif-mask">
            <rect width={width} height={height} fill="url(#motif-fade)" />
          </mask>
        </defs>
        <g mask="url(#motif-mask)">{cells}</g>
      </svg>
    </div>
  );
}
