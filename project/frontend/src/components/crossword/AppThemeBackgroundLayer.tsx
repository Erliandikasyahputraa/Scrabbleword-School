/**
 * AppThemeBackgroundLayer
 *
 * Renders 8-15 large Lucide-sourced SVG icons as fixed decorative illustrations
 * behind the entire application. Each theme has its own icon set, color, and placement.
 *
 * All SVG paths © Lucide Contributors — ISC License (installed locally, no CDN).
 * Inline SVG rendering ensures: offline support, zero network deps, animatable, responsive.
 *
 * Opacity: 3-6% — visible as subtle atmosphere without competing with content.
 */

import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import type { ThemeId } from './ThemeBackground';

interface PlacedIcon {
  paths: string[];
  circles?: { cx: number; cy: number; r: number }[];
  rects?: { x: number; y: number; w: number; h: number; rx?: number }[];
  /** % from left */
  left: number;
  /** % from top */
  top: number;
  rotate: number;
  /** px — icon viewport size before scale */
  size: number;
  opacity: number;
}

// ─── CLASSIC ──────────────────────────────────────────────────────────────────
// Pen, scroll, feather, book — elegant academic

const CLASSIC_ICONS: PlacedIcon[] = [
  // BookOpen — top-left
  { paths: ['M12 7v14','M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'], left: 3, top: 8, rotate: -12, size: 120, opacity: 0.055 },
  // Pencil — top-right
  { paths: ['M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z','m15 5 4 4'], left: 82, top: 5, rotate: 20, size: 100, opacity: 0.05 },
  // Feather — center-left
  { paths: ['M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z','M16 8 2 22','M17.5 15H9'], left: 6, top: 48, rotate: 15, size: 110, opacity: 0.05 },
  // Ruler — bottom-right
  { paths: ['M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z','m14.5 12.5 2-2','m11.5 9.5 2-2','m8.5 6.5 2-2','m17.5 15.5 2-2'], left: 78, top: 72, rotate: -35, size: 90, opacity: 0.04 },
  // BookOpen 2 — bottom-left
  { paths: ['M12 7v14','M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'], left: 45, top: 78, rotate: 8, size: 90, opacity: 0.04 },
  // Scroll — mid-right
  { paths: ['M19 17V5a2 2 0 0 0-2-2H4','M8 21h12a2 2 0 0 0 0-4H8m0 4a2 2 0 0 1 0-4m0 4v-4m0-14H6a2 2 0 0 0-2 2v14a2 2 0 0 0 4 0'], left: 88, top: 38, rotate: -8, size: 95, opacity: 0.045 },
  // Pencil — center
  { paths: ['M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z','m15 5 4 4'], left: 52, top: 22, rotate: -25, size: 75, opacity: 0.04 },
  // Bookmark — far left mid
  { paths: ['m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z'], left: 1, top: 72, rotate: 5, size: 80, opacity: 0.04 },
];

// ─── EDUCATION ────────────────────────────────────────────────────────────────

const EDUCATION_ICONS: PlacedIcon[] = [
  // BookOpen — top-left large
  { paths: ['M12 7v14','M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'], left: 2, top: 5, rotate: -15, size: 130, opacity: 0.055 },
  // GraduationCap — top-right
  { paths: ['M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z','M22 10v6','M6 12.5V16a6 3 0 0 0 12 0v-3.5'], left: 80, top: 4, rotate: 10, size: 115, opacity: 0.055 },
  // Atom — center
  { paths: ['M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z','M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z'], circles: [{cx:12,cy:12,r:1}], left: 42, top: 30, rotate: 25, size: 120, opacity: 0.05 },
  // Microscope — bottom-left
  { paths: ['M6 18h8','M3 22h18','M14 22a7 7 0 1 0 0-14h-1','M9 14h2','M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z','M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3'], left: 5, top: 68, rotate: -10, size: 110, opacity: 0.055 },
  // Globe — bottom-right
  { paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20','M2 12h20'], left: 78, top: 70, rotate: 5, size: 120, opacity: 0.05 },
  // Pencil — mid-right
  { paths: ['M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z','m15 5 4 4'], left: 87, top: 40, rotate: 30, size: 95, opacity: 0.045 },
  // Ruler — top-center
  { paths: ['M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z','m14.5 12.5 2-2','m11.5 9.5 2-2','m8.5 6.5 2-2','m17.5 15.5 2-2'], left: 38, top: 8, rotate: -30, size: 85, opacity: 0.045 },
  // Award — left-mid
  { paths: ['m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'], circles: [{cx:12,cy:8,r:6}], left: 1, top: 38, rotate: 0, size: 90, opacity: 0.04 },
  // BookOpen small repeat — bottom center
  { paths: ['M12 7v14','M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'], left: 50, top: 82, rotate: 12, size: 80, opacity: 0.04 },
];

// ─── NATURE ───────────────────────────────────────────────────────────────────

const NATURE_ICONS: PlacedIcon[] = [
  // Leaf large — top-left
  { paths: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z','M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'], left: 1, top: 3, rotate: -20, size: 140, opacity: 0.055 },
  // Mountain — center-left
  { paths: ['m8 3 4 8 5-5 5 15H2L8 3z'], left: 5, top: 55, rotate: 0, size: 160, opacity: 0.055 },
  // Cloud — top-right
  { paths: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'], left: 74, top: 6, rotate: 0, size: 130, opacity: 0.055 },
  // Flower — center
  { paths: ['M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1','M12 10v12','M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z','M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z'], circles:[{cx:12,cy:8,r:2}], left: 42, top: 35, rotate: 0, size: 120, opacity: 0.05 },
  // Bird — top-center
  { paths: ['M16 7h.01','M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20','m20 7 2 .5-2 .5','M10 18v3','M14 17.75V21','M7 18a6 6 0 0 0 3.84-10.61'], left: 55, top: 8, rotate: 0, size: 110, opacity: 0.05 },
  // Wind — right-mid
  { paths: ['M12.8 19.6A2 2 0 1 0 14 16H2','M17.5 8a2.5 2.5 0 1 1 2 4H2','M9.8 4.4A2 2 0 1 1 11 8H2'], left: 82, top: 42, rotate: 0, size: 110, opacity: 0.05 },
  // Leaf small — bottom-right
  { paths: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z','M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'], left: 80, top: 72, rotate: 30, size: 100, opacity: 0.05 },
  // Droplets — bottom-center
  { paths: ['M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z','M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97'], left: 38, top: 78, rotate: 0, size: 100, opacity: 0.045 },
  // Cloud small — bottom-left
  { paths: ['M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z'], left: 25, top: 12, rotate: 0, size: 90, opacity: 0.04 },
];

// ─── TECHNOLOGY ───────────────────────────────────────────────────────────────

const TECHNOLOGY_ICONS: PlacedIcon[] = [
  // CPU large — top-left
  { paths: ['M12 20v2','M12 2v2','M17 20v2','M17 2v2','M2 12h2','M2 17h2','M2 7h2','M20 12h2','M20 17h2','M20 7h2','M7 20v2','M7 2v2'], rects:[{x:4,y:4,w:16,h:16,rx:2},{x:8,y:8,w:8,h:8,rx:1}], left: 1, top: 3, rotate: 0, size: 140, opacity: 0.06 },
  // Bot — top-right
  { paths: ['M12 8V4H8','M2 14h2','M20 14h2','M15 13v2','M9 13v2'], rects:[{x:4,y:8,w:16,h:12,rx:2}], left: 80, top: 5, rotate: -10, size: 120, opacity: 0.06 },
  // Terminal — center
  { paths: ['M12 19h8','m4 17 6-6-6-6'], left: 40, top: 32, rotate: 0, size: 130, opacity: 0.055 },
  // Network — left-mid
  { paths: ['M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3','M12 12V8'], rects:[{x:16,y:16,w:6,h:6,rx:1},{x:2,y:16,w:6,h:6,rx:1},{x:9,y:2,w:6,h:6,rx:1}], left: 4, top: 58, rotate: 0, size: 120, opacity: 0.055 },
  // Brain — bottom-right
  { paths: ['M12 18V5','M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4','M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5','M17.997 5.125a4 4 0 0 1 2.526 5.77','M18 18a4 4 0 0 0 2-7.464','M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517','M6 18a4 4 0 0 1-2-7.464','M6.003 5.125a4 4 0 0 0-2.526 5.77'], left: 78, top: 65, rotate: 0, size: 130, opacity: 0.06 },
  // Sparkles — top-center
  { paths: ['M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z','M20 2v4','M22 4h-4'], circles:[{cx:4,cy:20,r:2}], left: 46, top: 68, rotate: 15, size: 100, opacity: 0.055 },
  // Wifi — right-top
  { paths: ['M12 20h.01','M2 8.82a15 15 0 0 1 20 0','M5 12.859a10 10 0 0 1 14 0','M8.5 16.429a5 5 0 0 1 7 0'], left: 86, top: 32, rotate: 0, size: 100, opacity: 0.05 },
  // Cpu small repeat — bottom-left
  { paths: ['M12 20v2','M12 2v2','M17 20v2','M17 2v2','M2 12h2','M2 17h2','M2 7h2','M20 12h2','M20 17h2','M20 7h2','M7 20v2','M7 2v2'], rects:[{x:4,y:4,w:16,h:16,rx:2},{x:8,y:8,w:8,h:8,rx:1}], left: 35, top: 8, rotate: 15, size: 80, opacity: 0.04 },
];

// ─── SPACE ────────────────────────────────────────────────────────────────────

const SPACE_ICONS: PlacedIcon[] = [
  // Moon — top-left large
  { paths: ['M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'], left: 1, top: 4, rotate: 0, size: 150, opacity: 0.065 },
  // Rocket — top-right
  { paths: ['M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5','M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09','M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z','M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05'], left: 78, top: 3, rotate: 35, size: 140, opacity: 0.065 },
  // Star large — center
  { paths: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'], left: 38, top: 30, rotate: 15, size: 140, opacity: 0.06 },
  // Satellite — bottom-right
  { paths: ['m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5','M16.5 7.5 19 5','m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5','M9 21a6 6 0 0 0-6-6','M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z'], left: 76, top: 70, rotate: -15, size: 125, opacity: 0.06 },
  // Sparkles — left-mid
  { paths: ['M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z','M20 2v4','M22 4h-4'], circles:[{cx:4,cy:20,r:2}], left: 3, top: 55, rotate: 0, size: 110, opacity: 0.06 },
  // Star small — bottom-left
  { paths: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'], left: 22, top: 78, rotate: 0, size: 85, opacity: 0.055 },
  // Moon small — right-mid
  { paths: ['M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'], left: 88, top: 42, rotate: -20, size: 85, opacity: 0.055 },
  // Rocket small — bottom-center
  { paths: ['M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5','M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09','M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z','M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05'], left: 52, top: 72, rotate: 15, size: 90, opacity: 0.05 },
];

// ─── BATIK ────────────────────────────────────────────────────────────────────
// Use Diamond, Circle, Hexagon, Compass — geometric, authentic to batik geometry

const BATIK_ICONS: PlacedIcon[] = [
  // Large Kawung circle cluster — top-left
  { paths: [], circles:[{cx:12,cy:12,r:10},{cx:12,cy:5,r:5},{cx:12,cy:19,r:5},{cx:5,cy:12,r:5},{cx:19,cy:12,r:5}], left: 1, top: 3, rotate: 0, size: 140, opacity: 0.06 },
  // Parang diagonal lines — top-right
  { paths: ['M5 3l14 18','M3 8l18 8','M8 3l13 16'], left: 77, top: 2, rotate: 0, size: 130, opacity: 0.055 },
  // Compass — center
  { paths: ['M12 2v20','M2 12h20','m4.93 4.93 14.14 14.14','m19.07 4.93-14.14 14.14'], circles:[{cx:12,cy:12,r:10},{cx:12,cy:12,r:2}], left: 38, top: 30, rotate: 15, size: 140, opacity: 0.06 },
  // Hexagonal repeat (Ceplok motif) — bottom-right
  { paths: ['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'], left: 76, top: 65, rotate: 0, size: 130, opacity: 0.06 },
  // Circle set — left-mid (Kawung)
  { paths: [], circles:[{cx:12,cy:12,r:10},{cx:12,cy:5,r:4},{cx:12,cy:19,r:4},{cx:5,cy:12,r:4},{cx:19,cy:12,r:4}], left: 3, top: 55, rotate: 0, size: 110, opacity: 0.055 },
  // Octagon — bottom-left (Mega-mendung inspired)
  { paths: ['M2.586 16.726 7.1 21.241a2 2 0 0 0 1.415.587H15.5a2 2 0 0 0 1.414-.586l4.5-4.501A2 2 0 0 0 22 15.5V8.5a2 2 0 0 0-.587-1.415L16.9 2.573A2 2 0 0 0 15.499 2H8.5a2 2 0 0 0-1.414.586l-4.5 4.501A2 2 0 0 0 2 8.5v7a2 2 0 0 0 .586 1.226z'], left: 24, top: 76, rotate: 22, size: 120, opacity: 0.055 },
  // Diamond/Rhombus — top-center
  { paths: ['M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0z'], left: 50, top: 5, rotate: 0, size: 110, opacity: 0.05 },
  // Parang repeat small — right-center
  { paths: ['M5 3l14 18','M3 8l18 8','M8 3l13 16'], left: 86, top: 38, rotate: 45, size: 90, opacity: 0.05 },
  // Small hexagon — bottom-center
  { paths: ['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'], left: 43, top: 80, rotate: 30, size: 85, opacity: 0.045 },
];

// ─── Theme icon map ────────────────────────────────────────────────────────────

const THEME_ICONS: Record<ThemeId, PlacedIcon[]> = {
  classic: CLASSIC_ICONS,
  education: EDUCATION_ICONS,
  nature: NATURE_ICONS,
  technology: TECHNOLOGY_ICONS,
  space: SPACE_ICONS,
  batik: BATIK_ICONS,
};

// ─── Renderer ─────────────────────────────────────────────────────────────────

function renderIcon(icon: PlacedIcon, color: string, idx: number) {
  const viewSize = 24;
  const scaleFactor = icon.size / viewSize;
  return (
    <div
      key={idx}
      className="absolute pointer-events-none"
      style={{
        left: `${icon.left}%`,
        top: `${icon.top}%`,
        width: icon.size,
        height: icon.size,
        transform: `rotate(${icon.rotate}deg)`,
        opacity: icon.opacity,
        willChange: 'opacity',
      }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        width={icon.size}
        height={icon.size}
        fill="none"
        stroke={color}
        strokeWidth={Math.max(0.8, 1.5 / Math.sqrt(scaleFactor))}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon.paths.map((d, pi) => <path key={pi} d={d} />)}
        {icon.circles?.map((c, ci) => (
          <circle key={ci} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
        {icon.rects?.map((r, ri) => (
          <rect key={ri} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} />
        ))}
      </svg>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * AppThemeBackgroundLayer — fixed, full-screen decorative background layer.
 * Renders 8-15 large Lucide-sourced SVG icons behind the entire application.
 * Opacity: 3-6% per icon.
 * Must be placed INSIDE CrosswordThemeProvider to receive the active theme.
 */
export function AppThemeBackgroundLayer() {
  const { activeTheme } = useCrosswordTheme();
  const icons = THEME_ICONS[activeTheme.id as ThemeId] ?? CLASSIC_ICONS;
  const color = activeTheme.tokens.illustrationColor;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
      style={{ transition: 'opacity 600ms ease' }}
    >
      {icons.map((icon, idx) => renderIcon(icon, color, idx))}
    </div>
  );
}
