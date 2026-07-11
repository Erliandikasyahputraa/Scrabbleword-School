import { useCrossword } from '../../hooks/useCrossword';

type CrosswordCellProps = {
  row: number;
  col: number;
};

export function CrosswordCell({ row, col }: CrosswordCellProps) {
  const { 
    userAnswers, 
    selectedCell, 
    handleCellClick, 
    isCellPlayable, 
    isCellInActiveWord, 
    getCellNumber 
  } = useCrossword();

  const isPlayable = isCellPlayable(row, col);
  
  if (!isPlayable) {
    return <div className="w-full h-full bg-slate-900/5 dark:bg-slate-800 rounded sm:rounded-md"></div>;
  }

  const number = getCellNumber(row, col);
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inActiveWord = isCellInActiveWord(row, col);
  const answer = userAnswers[`${row}-${col}`] || '';

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center border sm:border-2 rounded sm:rounded-md transition-colors cursor-pointer select-none
        ${isSelected ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_0_1px_rgba(59,130,246,0.3)] sm:shadow-[0_0_0_2px_rgba(59,130,246,0.3)] z-10' : 
          inActiveWord ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 
          'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
      onClick={() => handleCellClick(row, col)}
    >
      {number && (
        <span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-[8px] sm:text-[10px] md:text-xs font-bold text-slate-500 leading-none">
          {number}
        </span>
      )}
      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl uppercase font-semibold text-slate-800 dark:text-slate-100">
        {answer}
      </span>
    </div>
  );
}
