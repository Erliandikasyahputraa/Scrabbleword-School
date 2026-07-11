import type { CrosswordTheme } from '../types/theme';

export const classicPaperTheme: CrosswordTheme = {
  id: 'classic-paper',
  name: 'Classic Paper',
  background: 'bg-[#f4f1ea] bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.04\'/%3E%3C/svg%3E")]',
  board: 'bg-black p-[1px] gap-[1px] border-2 border-black shadow-sm rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-black/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
  selectedCell: 'bg-yellow-200 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-600 font-semibold',
  hover: 'hover:bg-slate-100 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-serif',
};
