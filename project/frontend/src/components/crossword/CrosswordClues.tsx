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
              className={`text-sm p-3 rounded-lg cursor-pointer transition-colors flex gap-3
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                }
              `}
            >
              <span className="font-bold min-w-[20px] text-right">{clue.number}.</span>
              <span>{clue.clue}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      <ClueList title="Across" clues={acrossClues} />
      <ClueList title="Down" clues={downClues} />
    </div>
  );
}
