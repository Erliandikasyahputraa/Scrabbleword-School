import { classicTheme } from './classic';
import { educationTheme } from './education';
import { batikTheme } from './batik';
import { spaceTheme } from './space';
import { technologyTheme } from './technology';
import { natureTheme } from './nature';

export const themes = [
  classicTheme,
  educationTheme,
  batikTheme,
  spaceTheme,
  technologyTheme,
  natureTheme
];

export const defaultTheme = classicTheme;

export * from './classic';
export * from './education';
export * from './batik';
export * from './space';
export * from './technology';
export * from './nature';
