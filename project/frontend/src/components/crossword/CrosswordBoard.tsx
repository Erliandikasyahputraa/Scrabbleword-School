import { useRef } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import { CrosswordCell } from './CrosswordCell';
import { ThemeBoardBackground } from '../theme/ThemeBoardBackground';

export function CrosswordBoard() {
  const { data, handleKeyDown, isSubmitted } = useCrossword();
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full flex justify-center items-center @container/board relative">
      <div
        ref={boardRef}
        className={`relative box-content flex justify-center items-center focus:outline-none focus:ring-4 focus:ring-[var(--workspace-ring)] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all ${isSubmitted ? 'opacity-80 pointer-events-none' : ''}`}
        style={{ 
          // 1. Padding adaptif: pada grid besar atau mobile, padding minimal agar muat
          '--board-padding': 'clamp(8px, 2.5cqw, 24px)',
          padding: 'var(--board-padding)',
          
          // 2. Ruang yang tersedia dalam kontainer
          '--avail-w': 'calc(100cqw - (var(--board-padding) * 2))',
          '--avail-h': 'calc(100cqh - (var(--board-padding) * 2))',
          
          // 3. Hitung lebar cell maksimum agar seluruh grid pas persis di layar
          '--max-cell-w': `calc(var(--avail-w) / ${data.grid.cols})`,
          '--max-cell-h': `calc(var(--avail-h) / ${data.grid.rows})`,
          
          // 4. Batasi minimum cell agar tetap terbaca dan responsif di layar kecil/soal banyak
          '--cell-size': `clamp(18px, min(var(--max-cell-w), var(--max-cell-h)), 50px)`,
          
          // 5. Terapkan dimensi grid
          width: `calc(var(--cell-size) * ${data.grid.cols})`,
          height: `calc(var(--cell-size) * ${data.grid.rows})`,
          maxWidth: '100%',
          maxHeight: '100%'
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        aria-label="Crossword Puzzle Board"
      >
        {/* Theme atmospheric background */}
        <ThemeBoardBackground />

        {/* The crossword grid */}
        <div
          className="relative w-full h-full"
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
