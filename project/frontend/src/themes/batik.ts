import type { CrosswordTheme } from '../types/theme';

export const batikTheme: CrosswordTheme = {
  id: 'batik',
  name: 'Batik',
  background: 'bg-[#fef3c7] bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2378350f\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M30 0l15 15-15 15L15 15zM0 30l15-15 15 15-15 15zM60 30l-15-15-15 15 15 15zM30 60l15-15-15-15-15 15z\'/%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'5\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-amber-900 p-[2px] gap-[2px] border-4 border-amber-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm',
  cell: 'bg-[#fffbeb]',
  blackCell: 'bg-amber-900/95',
  selectedCell: 'bg-amber-200 ring-2 ring-amber-600 z-10',
  completedCell: 'bg-orange-50 text-orange-950',
  clueNumber: 'text-amber-950/50 font-semibold',
  hover: 'hover:bg-amber-100 transition-colors duration-150',
  typography: 'text-amber-950 font-bold font-serif',
};
