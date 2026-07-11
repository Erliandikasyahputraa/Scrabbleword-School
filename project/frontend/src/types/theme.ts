/**
 * CrosswordTheme — complete design language token set.
 * 
 * Board-level fields (cell, blackCell, etc.) remain CSS classes for the crossword grid.
 * App-level fields (tokens) are HSL values that get injected into :root CSS variables,
 * propagating across cards, buttons, badges, focus rings, and scrollbar accents.
 */
export interface CrosswordTheme {
  id: string;
  name: string;

  // ── Board-level classes (applied to crossword grid only) ──────────────────
  background: string;
  board: string;
  cell: string;
  blackCell: string;
  selectedCell: string;
  completedCell: string;
  clueNumber: string;
  hover: string;
  typography: string;

  // ── Design language tokens (HSL values, injected as CSS variables) ────────
  tokens: {
    /** Primary brand color. HSL e.g. "221 83% 53%" */
    primary: string;
    /** Focus ring & active accent. HSL */
    ring: string;
    /** Card border tint. HSL */
    border: string;
    /** Card header / accent stripe. CSS color e.g. "#1d4ed8" */
    accentStripe: string;
    /** Scrollbar thumb color. CSS color */
    scrollbar: string;
    /** Badge background. CSS color */
    badge: string;
    /** Badge text. CSS color */
    badgeText: string;
    /** Button primary bg. CSS color */
    buttonPrimary: string;
    /** Button primary text. CSS color */
    buttonPrimaryText: string;
    /** Card hover shadow color (rgba). */
    cardShadow: string;
    /** Ambient background page color override (CSS color). */
    pageBackground: string;
    /** SVG illustration stroke/fill color (for ThemeBackground) */
    illustrationColor: string;
  };
}
