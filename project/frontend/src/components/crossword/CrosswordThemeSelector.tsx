import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import type { CrosswordTheme } from '../../types/theme';
import { Check, Palette } from 'lucide-react';
import { ThemeBackground } from './ThemeBackground';
import type { ThemeId } from './ThemeBackground';

// A 3x3 mock crossword grid pattern for the mini-preview
const MOCK_GRID = [
  [true,  true,  false],
  [false, true,  true ],
  [true,  true,  false],
];

export function CrosswordThemeSelector() {
  const { activeTheme, setTheme, availableThemes } = useCrosswordTheme();

  return (
    <div className="flex flex-col space-y-2 w-full">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
        <Palette size={13} /> Theme Gallery
      </h3>
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {availableThemes.map((theme: CrosswordTheme) => {
          const isActive = activeTheme.id === theme.id;
          return (
            <button
              type="button"
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              title={theme.name}
              className={`relative flex flex-col text-left rounded-lg overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-1 ${
                isActive
                  ? 'ring-2 ring-primary shadow-md scale-[1.03]'
                  : 'ring-1 ring-border hover:ring-primary/40 hover:shadow-sm hover:scale-[1.02]'
              }`}
              aria-pressed={isActive}
            >
              {/* Mini Theme Preview — atmospheric background + crossword grid */}
              <div className={`relative h-11 w-full overflow-hidden ${theme.background} transition-colors duration-300`}>
                {/* Decorative background illustration */}
                <ThemeBackground
                  themeId={theme.id as ThemeId}
                  opacity={theme.id === 'batik' ? 0.08 : 0.06}
                />

                {/* Mini crossword grid — centered in the card */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div
                    className={`transition-all duration-300 group-hover:scale-105 ${theme.board}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gridTemplateRows: 'repeat(3, 1fr)',
                      width: 30,
                      height: 30,
                    }}
                  >
                    {MOCK_GRID.map((row, rIdx) =>
                      row.map((isWhite, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`w-full h-full ${isWhite ? theme.cell : theme.blackCell}`}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-20" />
              </div>

              {/* Theme name + active indicator */}
              <div className="px-2 py-1 w-full flex items-center justify-between bg-card border-t border-border/40">
                <span className="text-[9px] font-semibold text-foreground/80 truncate leading-none">
                  {theme.name}
                </span>
                {isActive && (
                  <Check
                    size={9}
                    strokeWidth={3.5}
                    className="text-primary shrink-0 animate-in zoom-in-75 duration-150"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
