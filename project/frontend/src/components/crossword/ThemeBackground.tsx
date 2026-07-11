/**
 * Theme Background System
 * 
 * Renders Lucide-sourced SVG icons as decorative backgrounds for crossword themes.
 * Icons are sourced from lucide-react (ISC License) paths.
 * All icons are placed with low opacity (2-4%) to create atmospheric backgrounds
 * without competing with the crossword grid content.
 * 
 * @license ISC (Lucide icons)
 */




export type ThemeId = 'classic' | 'education' | 'nature' | 'technology' | 'space' | 'batik';

interface Props {
  themeId: ThemeId;
  className?: string;
  opacity?: number;
}

// ---- Classic Paper ----
// Subtle paper grain created with light staggered lines and dots

function ClassicBackground({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Fiber lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <line
          key={i}
          x1={`${(i * 6.2) % 100}%`} y1="0%"
          x2={`${((i * 6.2) + 2) % 100}%`} y2="100%"
          stroke="#92400e" strokeWidth="0.5" strokeOpacity="0.4"
        />
      ))}
      {/* Grain dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={`d-${i}`}
          cx={`${(i * 37.7) % 100}%`}
          cy={`${(i * 23.3) % 100}%`}
          r="0.8"
          fill="#92400e"
          fillOpacity="0.3"
        />
      ))}
    </svg>
  );
}

// ---- Education ----
// Book, pencil, graduation-cap, globe, atom, microscope, ruler
// SVG paths sourced from lucide-react (ISC License)

const EDUCATION_ICONS: { paths: string[]; x: number; y: number; rotate?: number; scale?: number }[] = [
  // book-open at top-left
  {
    paths: [
      'M12 7v14',
      'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
    ],
    x: 6, y: 8, rotate: -15, scale: 2.8
  },
  // pencil at top-right
  {
    paths: [
      'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
      'm15 5 4 4',
    ],
    x: 72, y: 6, rotate: 25, scale: 2.5
  },
  // graduation-cap at center-left
  {
    paths: [
      'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
      'M22 10v6',
      'M6 12.5V16a6 3 0 0 0 12 0v-3.5',
    ],
    x: 38, y: 40, rotate: 8, scale: 3.0
  },
  // globe at bottom-right
  {
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
      'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
      'M2 12h20',
    ],
    x: 75, y: 62, rotate: -5, scale: 2.7
  },
  // atom at bottom-left
  {
    paths: [
      'M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z',
      'M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z',
    ],
    x: 12, y: 62, rotate: 15, scale: 2.2
  },
  // ruler at top-center
  {
    paths: [
      'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z',
      'm14.5 12.5 2-2',
      'm11.5 9.5 2-2',
      'm8.5 6.5 2-2',
      'm17.5 15.5 2-2',
    ],
    x: 52, y: 18, rotate: -30, scale: 2.0
  },
];

function EducationBackground({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {EDUCATION_ICONS.map((icon, idx) => {
        const s = icon.scale ?? 2;
        const cx = (24 / 2) * s;
        const cy = (24 / 2) * s;
        return (
          <g
            key={idx}
            transform={`translate(${icon.x}, ${icon.y}) rotate(${icon.rotate ?? 0} ${cx} ${cy}) scale(${s / 24})`}
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.paths.map((d, pi) => <path key={pi} d={d} />)}
          </g>
        );
      })}
    </svg>
  );
}

// ---- Nature ----
// leaf, flower-2, mountain, cloud, bird, wind
// SVG paths sourced from lucide-react (ISC License)

const NATURE_ICONS: { paths: string[]; circles?: { cx: number; cy: number; r: number }[]; x: number; y: number; rotate?: number; scale?: number }[] = [
  // leaf
  {
    paths: [
      'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
      'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
    ],
    x: 8, y: 5, rotate: -20, scale: 3.2
  },
  // flower-2
  {
    paths: [
      'M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1',
      'M12 10v12',
      'M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z',
      'M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z',
    ],
    circles: [{ cx: 12, cy: 8, r: 2 }],
    x: 68, y: 8, rotate: 10, scale: 2.8
  },
  // mountain
  {
    paths: ['m8 3 4 8 5-5 5 15H2L8 3z'],
    x: 35, y: 50, rotate: 0, scale: 4.0
  },
  // cloud
  {
    paths: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'],
    x: 65, y: 52, rotate: 0, scale: 3.0
  },
  // bird
  {
    paths: [
      'M16 7h.01',
      'M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20',
      'm20 7 2 .5-2 .5',
      'M10 18v3',
      'M14 17.75V21',
      'M7 18a6 6 0 0 0 3.84-10.61',
    ],
    x: 8, y: 55, rotate: 0, scale: 2.5
  },
  // wind
  {
    paths: [
      'M12.8 19.6A2 2 0 1 0 14 16H2',
      'M17.5 8a2.5 2.5 0 1 1 2 4H2',
      'M9.8 4.4A2 2 0 1 1 11 8H2',
    ],
    x: 50, y: 22, rotate: 0, scale: 2.2
  },
  // second leaf rotated
  {
    paths: [
      'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
      'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
    ],
    x: 78, y: 38, rotate: 45, scale: 2.2
  },
];

function NatureBackground({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {NATURE_ICONS.map((icon, idx) => {
        const s = icon.scale ?? 2;
        const cx = (24 / 2) * s;
        const cy = (24 / 2) * s;
        return (
          <g
            key={idx}
            transform={`translate(${icon.x}, ${icon.y}) rotate(${icon.rotate ?? 0} ${cx} ${cy}) scale(${s / 24})`}
            fill="none"
            stroke="#14532d"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.paths.map((d, pi) => <path key={pi} d={d} />)}
            {icon.circles?.map((c, ci) => (
              <circle key={ci} cx={c.cx} cy={c.cy} r={c.r} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ---- Technology ----
// cpu, bot, terminal, network, brain, sparkles
// SVG paths sourced from lucide-react (ISC License)

const TECH_ICONS: { paths: string[]; rects?: { x: number; y: number; w: number; h: number; rx?: number }[]; x: number; y: number; rotate?: number; scale?: number }[] = [
  // cpu
  {
    paths: [
      'M12 20v2','M12 2v2','M17 20v2','M17 2v2',
      'M2 12h2','M2 17h2','M2 7h2',
      'M20 12h2','M20 17h2','M20 7h2',
      'M7 20v2','M7 2v2',
    ],
    rects: [
      { x: 4, y: 4, w: 16, h: 16, rx: 2 },
      { x: 8, y: 8, w: 8, h: 8, rx: 1 },
    ],
    x: 4, y: 4, rotate: 0, scale: 3.2
  },
  // bot
  {
    paths: [
      'M12 8V4H8', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2',
    ],
    rects: [{ x: 4, y: 8, w: 16, h: 12, rx: 2 }],
    x: 68, y: 8, rotate: -10, scale: 3.0
  },
  // terminal
  {
    paths: ['M12 19h8', 'm4 17 6-6-6-6'],
    x: 35, y: 20, rotate: 5, scale: 2.8
  },
  // network
  {
    paths: [
      'M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3',
      'M12 12V8',
    ],
    rects: [
      { x: 16, y: 16, w: 6, h: 6, rx: 1 },
      { x: 2, y: 16, w: 6, h: 6, rx: 1 },
      { x: 9, y: 2, w: 6, h: 6, rx: 1 },
    ],
    x: 10, y: 55, rotate: 0, scale: 2.6
  },
  // brain
  {
    paths: [
      'M12 18V5',
      'M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4',
      'M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5',
      'M17.997 5.125a4 4 0 0 1 2.526 5.77',
      'M18 18a4 4 0 0 0 2-7.464',
      'M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517',
      'M6 18a4 4 0 0 1-2-7.464',
      'M6.003 5.125a4 4 0 0 0-2.526 5.77',
    ],
    x: 66, y: 50, rotate: -5, scale: 3.2
  },
  // sparkles
  {
    paths: [
      'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z',
      'M20 2v4', 'M22 4h-4',
    ],
    x: 40, y: 58, rotate: 0, scale: 2.0
  },
];

function TechnologyBackground({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {TECH_ICONS.map((icon, idx) => {
        const s = icon.scale ?? 2;
        const cx = (24 / 2) * s;
        const cy = (24 / 2) * s;
        return (
          <g
            key={idx}
            transform={`translate(${icon.x}, ${icon.y}) rotate(${icon.rotate ?? 0} ${cx} ${cy}) scale(${s / 24})`}
            fill="none"
            stroke="#0f4c75"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.paths.map((d, pi) => <path key={pi} d={d} />)}
            {icon.rects?.map((r, ri) => (
              <rect key={ri} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ---- Space ----
// rocket, moon, star, satellite
// SVG paths sourced from lucide-react (ISC License)

const SPACE_ICONS: { paths: string[]; circles?: { cx: number; cy: number; r: number }[]; x: number; y: number; rotate?: number; scale?: number }[] = [
  // rocket
  {
    paths: [
      'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
      'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09',
      'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z',
      'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05',
    ],
    x: 55, y: 4, rotate: 30, scale: 3.2
  },
  // moon
  {
    paths: ['M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'],
    x: 4, y: 6, rotate: 0, scale: 3.5
  },
  // star (large)
  {
    paths: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
    x: 30, y: 50, rotate: 10, scale: 3.0
  },
  // satellite
  {
    paths: [
      'm13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5',
      'M16.5 7.5 19 5',
      'm17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5',
      'M9 21a6 6 0 0 0-6-6',
      'M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z',
    ],
    x: 58, y: 55, rotate: -15, scale: 2.8
  },
  // small star (top-right)
  {
    paths: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
    x: 80, y: 28, rotate: -5, scale: 1.6
  },
  // sparkles (star dot cluster)
  {
    paths: [
      'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z',
      'M20 2v4', 'M22 4h-4',
    ],
    x: 8, y: 62, rotate: 0, scale: 1.8
  },
];

function SpaceBackground({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Tiny dot stars */}
      {[
        [20,15],[48,8],[85,18],[12,45],[90,42],[68,30],[25,72],[55,80],[82,75]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.6" fill="#c7d2fe" fillOpacity="0.6" />
      ))}
      {SPACE_ICONS.map((icon, idx) => {
        const s = icon.scale ?? 2;
        const cx = (24 / 2) * s;
        const cy = (24 / 2) * s;
        return (
          <g
            key={idx}
            transform={`translate(${icon.x}, ${icon.y}) rotate(${icon.rotate ?? 0} ${cx} ${cy}) scale(${s / 24})`}
            fill="none"
            stroke="#c7d2fe"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.paths.map((d, pi) => <path key={pi} d={d} />)}
            {icon.circles?.map((c, ci) => (
              <circle key={ci} cx={c.cx} cy={c.cy} r={c.r} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ---- Batik ----
// Authentic Kawung & Parang motifs — geometric, clean, repeating
// These are carefully hand-crafted from traditional motif rules

function BatikBackground({ opacity }: { opacity: number }) {
  // Kawung pattern: 4 overlapping circles arranged in a diamond
  // Parang: diagonal parallel curves
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        {/* Kawung tile: 4 oval "petal" shapes */}
        <pattern id="batik-kawung" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#78350f" strokeWidth="1">
            <ellipse cx="12" cy="6" rx="5" ry="5.5" />
            <ellipse cx="12" cy="18" rx="5" ry="5.5" />
            <ellipse cx="6" cy="12" rx="5.5" ry="5" />
            <ellipse cx="18" cy="12" rx="5.5" ry="5" />
            <circle cx="12" cy="12" r="2.5" />
          </g>
        </pattern>
        {/* Parang tile: diagonal sweeping S-curve */}
        <pattern id="batik-parang" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#78350f" strokeWidth="1" strokeLinecap="round">
            <path d="M0 15 C10 5 20 5 40 15" />
            <path d="M0 10 C10 0 20 0 40 10" />
            <path d="M-10 20 C0 10 10 10 30 20" />
          </g>
        </pattern>
      </defs>
      {/* Upper half: Kawung */}
      <rect x="0" y="0" width="100%" height="50%" fill="url(#batik-kawung)" />
      {/* Lower half: Parang */}
      <rect x="0" y="50%" width="100%" height="50%" fill="url(#batik-parang)" />
    </svg>
  );
}

// ---- Main Export ----

export function ThemeBackground({ themeId, className = '', opacity = 0.04 }: Props) {
  const base = `absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-inherit ${className}`;
  return (
    <div className={base} aria-hidden="true">
      {themeId === 'classic' && <ClassicBackground opacity={opacity} />}
      {themeId === 'education' && <EducationBackground opacity={opacity} />}
      {themeId === 'nature' && <NatureBackground opacity={opacity} />}
      {themeId === 'technology' && <TechnologyBackground opacity={opacity} />}
      {themeId === 'space' && <SpaceBackground opacity={opacity} />}
      {themeId === 'batik' && <BatikBackground opacity={opacity} />}
    </div>
  );
}
