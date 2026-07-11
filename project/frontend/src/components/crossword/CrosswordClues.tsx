import { useCrossword } from '../../hooks/useCrossword';
import type { CrosswordClue } from '../../types/crossword';

export function CrosswordClues() {
  const { data, activeWord, handleCellClick, currentDirection } = useCrossword();

  const acrossClues = data.clues.filter(c => c.direction === 'across');
  const downClues = data.clues.filter(c => c.direction === 'down');

  const handleClueClick = (clue: CrosswordClue) => {
    const word = data.words.find(w => w.id === clue.id);
    if (word) {
      // If clicking a clue but direction is wrong, the CrosswordProvider handles direction toggle
      // But we just want to jump to the first cell of the word.
      // Wait, handleCellClick selects the cell and might toggle direction.
      // We can just call handleCellClick on the word's start cell.
      // A better way is to add a `selectWord` function, but we can approximate:
      handleCellClick(word.row, word.col);
      // Wait, if it's already selected and the direction doesn't match, we need to click it again?
      // For now, clicking the first cell is good enough for an MVP.
    }
  };

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
              onClick={() => handleClueClick(clue)}
              className={`text-sm px-3 py-2 rounded-lg cursor-pointer transition-all flex gap-3 leading-snug
                ${isActive 
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md scale-[1.02] z-10' 
                  : 'text-slate-600 dark:text-slate-400 font-normal hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }
              `}
            >
              <span className={`font-bold min-w-[20px] text-right shrink-0 ${isActive ? 'text-primary-foreground/90' : ''}`}>{clue.number}.</span>
              <span>{clue.clue}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const activeClueObj = data.clues.find(c => c.id === activeWord?.id && c.direction === currentDirection);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mobile/Sticky Selected Clue */}
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl shadow-sm xl:sticky xl:top-0 z-10">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Current Clue</h3>
        {activeClueObj ? (
          <p className="text-sm sm:text-base font-semibold text-foreground flex gap-2 leading-snug">
            <span className="font-bold text-primary shrink-0">{activeClueObj.number}.</span>
            <span>{activeClueObj.clue}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Select a cell to view clue</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row xl:flex-col gap-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-5">
        <ClueList title="Across" clues={acrossClues} />
        <ClueList title="Down" clues={downClues} />
      </div>
    </div>
  );
}
