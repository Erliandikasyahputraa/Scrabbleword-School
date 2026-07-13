import { useEffect, useRef } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import { CrosswordCell } from './CrosswordCell';
import { useCrosswordTheme } from '../../providers/CrosswordThemeProvider';
import { ThemeBackground } from './ThemeBackground';
import type { ThemeId } from './ThemeBackground';

export function CrosswordBoard() {
  const { data, handleKeyDown, isSubmitted } = useCrossword();
  const { activeTheme } = useCrosswordTheme();
  const boardRef = useRef<HTMLDivElement>(null);

  // Auto-focus the board when it mounts so keyboard nav works immediately
  useEffect(() => {
    if (boardRef.current && !isSubmitted) {
      boardRef.current.focus();
    }
  }, [isSubmitted]);

  return (
    <div className="w-full h-full flex justify-center items-center @container/board">
      <div
        ref={boardRef}
        className={`relative box-content flex justify-center items-center focus:outline-none focus:ring-4 focus:ring-primary/30 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${isSubmitted ? 'opacity-80 pointer-events-none' : ''}`}
        style={{ 
          // 1. Define internal padding based on container size using cqw (mobile ~20px, tablet ~40px, desktop ~64-80px)
          '--board-padding': 'clamp(20px, 6cqw, 80px)',
          padding: 'var(--board-padding)',
          
          // 2. Available width for the actual grid (container width - 2 * padding)
          '--avail-w': 'calc(100cqw - (var(--board-padding) * 2))',
          '--avail-h': 'calc(100cqh - (var(--board-padding) * 2))',
          
          // 3. Calculate max cell width and height that would fit the available space
          '--max-cell-w': `calc(var(--avail-w) / ${data.grid.cols})`,
          '--max-cell-h': `calc(var(--avail-h) / ${data.grid.rows})`,
          
          // 4. Take the minimum of the two to maintain aspect ratio perfectly
          // 5. Clamp between 32px and 54px for visual ergonomics (reduced from 64px for ~15% lighter feel)
          '--cell-size': `clamp(32px, min(var(--max-cell-w), var(--max-cell-h)), 54px)`,
          
          // 6. Set grid dimensions natively (box-content makes this apply only to the grid, not the padding)
          width: `calc(var(--cell-size) * ${data.grid.cols})`,
          height: `calc(var(--cell-size) * ${data.grid.rows})`
        } as React.CSSProperties}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Crossword Puzzle Board"
      >
        {/* Theme atmospheric background — sits behind the crossword grid */}
        <div className={`absolute inset-0 w-full h-full pointer-events-none transition-colors duration-500 ${activeTheme.background}`}>
          <ThemeBackground
            themeId={activeTheme.id as ThemeId}
            opacity={activeTheme.id === 'batik' ? 0.06 : 0.045}
          />
        </div>

        {/* The crossword grid — always the visual hero */}
        <div
          className={`relative w-full h-full`}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${data.grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${data.grid.rows}, 1fr)`
          }}
        >
          {Array.from({ length: data.grid.rows }).map((_, rowIndex) => (
            Array.from({ length: data.grid.cols }).map((_, colIndex) => (
              <CrosswordCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
              />
            ))
          ))}
        </div>
      </div>
    </div>
  );
}
