import type { CrosswordTheme } from '../types/theme';

export const classicTheme: CrosswordTheme = {
  id: 'classic',
  name: 'Classic Paper',
  // A very subtle noise/paper texture
  background: 'bg-[#f8f9fa] bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")]',
  board: 'bg-black p-[2px] gap-[2px] border-2 border-black shadow-md rounded-md',
  cell: 'bg-white',
  blackCell: 'bg-black',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-600 font-bold',
  hover: 'hover:bg-slate-100 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-serif',
};
