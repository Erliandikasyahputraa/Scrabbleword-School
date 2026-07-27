import { useEffect, useRef } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import type { CrosswordClue } from '../../types/crossword';
import { useTranslation } from 'react-i18next';

export function CrosswordClues() {
  const { t } = useTranslation('courses');
  const { data, activeWord, handleCellClick, currentDirection } = useCrossword();
  const listRef = useRef<HTMLDivElement>(null);

  const acrossClues = data.clues.filter(c => c.direction === 'across');
  const downClues = data.clues.filter(c => c.direction === 'down');

  const handleClueClick = (clue: CrosswordClue) => {
    const word = data.words.find(w => w.id === clue.id);
    if (word) {
      handleCellClick(word.row, word.col);
    }
  };

  useEffect(() => {
    if (activeWord) {
      // Find the active element in the list and scroll it into view smoothly
      const activeEl = listRef.current?.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeWord, currentDirection]);

  const ClueList = ({ title, clues }: { title: string, clues: CrosswordClue[] }) => (
    <div className="flex-1">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 uppercase text-sm tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2">
        {clues.map(clue => {
          const isActive = activeWord?.id === clue.id && currentDirection === clue.direction;
          return (
            <li 
              key={clue.id}
              data-active={isActive}
              onClick={() => handleClueClick(clue)}
              className={`text-sm px-3 py-2 rounded-lg cursor-pointer transition-all flex gap-3 leading-snug
                ${isActive 
                  ? 'text-white font-semibold shadow-md scale-[1.02] z-10' 
                  : 'text-slate-600 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }
              `}
              style={isActive ? { backgroundColor: 'var(--workspace-primary)' } : undefined}
            >
              <span className={`font-bold min-w-[20px] text-right shrink-0 ${isActive ? 'text-white/90' : ''}`}>{clue.number}.</span>
              <span>{clue.clue}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const activeClueObj = data.clues.find(c => c.id === activeWord?.id && c.direction === currentDirection);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Current Clue Card (Sticky) */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-sm shrink-0 z-10 sticky top-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md"
              style={{ color: 'var(--workspace-primary)', backgroundColor: 'var(--workspace-shadow)' }}
            >
              {currentDirection === 'across' ? t('across') : t('down')}
            </span>
            {activeClueObj && (
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('wordLabel')} {activeClueObj.number}
              </span>
            )}
          </div>
        </div>
        
        {activeClueObj ? (
          <p className="text-base sm:text-lg font-semibold text-foreground leading-snug mt-2">
            {activeClueObj.clue}
          </p>
        ) : (
          <p className="text-base text-muted-foreground italic mt-2">{t('selectCellToViewClue')}</p>
        )}
      </div>

      {/* Clue List Panel (Scrollable) */}
      <div 
        ref={listRef}
        className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-5 overflow-y-auto custom-scrollbar"
      >
        <ClueList title={t('across')} clues={acrossClues} />
        <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 my-2"></div>
        <ClueList title={t('down')} clues={downClues} />
      </div>
    </div>
  );
}
