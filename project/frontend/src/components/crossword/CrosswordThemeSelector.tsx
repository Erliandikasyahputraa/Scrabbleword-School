import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import type { CrosswordTheme } from '../../types/theme';
import { Check, Palette } from 'lucide-react';

export function CrosswordThemeSelector() {
  const { activeTheme, setTheme, availableThemes } = useCrosswordTheme();

  return (
    <div className="flex flex-col space-y-2 w-full">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
         <Palette size={16} /> Theme Gallery
      </h3>
      <div className="grid grid-cols-3 gap-2 w-full">
        {availableThemes.map((theme: CrosswordTheme) => (
          <button
            type="button"
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`relative flex flex-col text-left border-2 rounded-lg overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
              activeTheme.id === theme.id 
                ? 'border-primary ring-1 ring-primary shadow-sm bg-primary/5' 
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <div className={`h-12 w-full ${theme.background} flex items-center justify-center relative overflow-hidden`}>
              <div className={`grid grid-cols-3 grid-rows-3 aspect-square h-8 ${theme.board} relative z-10 transform group-hover:scale-105 transition-transform`}>
                {/* 3x3 Mock Grid */}
                {[
                  [true, true, false],
                  [false, true, true],
                  [true, true, false]
                ].map((row, rIdx) => 
                  row.map((isWhite, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className={`w-full h-full ${isWhite ? theme.cell : theme.blackCell}`} />
                  ))
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
            <div className="px-2 py-1.5 w-full flex items-center justify-between border-t border-border/50 bg-card">
              <span className="text-[10px] font-semibold text-foreground truncate pr-1">{theme.name}</span>
              {activeTheme.id === theme.id && (
                <div className="text-primary shrink-0 animate-in zoom-in-50">
                   <Check size={10} strokeWidth={4} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
