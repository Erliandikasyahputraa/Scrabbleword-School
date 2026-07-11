import { classicPaperTheme } from './classicPaper';
import { blueprintTheme } from './blueprint';
import { modernGridTheme } from './modernGrid';
import { dotGridTheme } from './dotGrid';
import { crosswordPatternTheme } from './crosswordPattern';
import { graphPaperTheme } from './graphPaper';

export const themes = [
  classicPaperTheme,
  blueprintTheme,
  modernGridTheme,
  dotGridTheme,
  crosswordPatternTheme,
  graphPaperTheme
];

export const defaultTheme = classicPaperTheme;

export * from './classicPaper';
export * from './blueprint';
export * from './modernGrid';
export * from './dotGrid';
export * from './crosswordPattern';
export * from './graphPaper';
