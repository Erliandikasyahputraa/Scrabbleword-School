import type { CrosswordTheme } from '../types/theme';

export const batikTheme: CrosswordTheme = {
  id: 'batik',
  name: 'Batik',
  background: 'bg-[#fef3c7] bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%2378350f\' stroke-width=\'2\' opacity=\'0.04\'%3E%3Ccircle cx=\'25\' cy=\'25\' r=\'20\'/%3E%3Ccircle cx=\'75\' cy=\'25\' r=\'20\'/%3E%3Ccircle cx=\'25\' cy=\'75\' r=\'20\'/%3E%3Ccircle cx=\'75\' cy=\'75\' r=\'20\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'10\'/%3E%3Cpath d=\'M25 25 L75 75 M25 75 L75 25\'/%3E%3C/g%3E%3C/svg%3E")]',
  board: 'bg-amber-900 p-[2px] gap-[2px] border-4 border-amber-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm',
  cell: 'bg-white',
  blackCell: 'bg-slate-950',
  selectedCell: 'bg-yellow-100 ring-2 ring-yellow-400 z-10',
  completedCell: 'bg-green-50 text-green-900',
  clueNumber: 'text-slate-500 font-bold',
  hover: 'hover:bg-slate-50 transition-colors duration-150',
  typography: 'text-slate-900 font-bold font-sans',
};
