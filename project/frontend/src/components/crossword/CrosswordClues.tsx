import { useState } from 'react';
import { useCrossword } from '../../hooks/useCrossword';
import type { CrosswordClue } from '../../types/crossword';
import { Button } from '../ui/Button';
import { X, List } from 'lucide-react';

export function CrosswordClues() {
  const { data, activeWord, handleCellClick, currentDirection } = useCrossword();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const acrossClues = data.clues.filter(c => c.direction === 'across');
  const downClues = data.clues.filter(c => c.direction === 'down');

  const handleClueClick = (clue: CrosswordClue) => {
    const word = data.words.find(w => w.id === clue.id);
    if (word) {
      handleCellClick(word.row, word.col);
      setIsModalOpen(false); // Close modal on selection
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
    <div className="flex flex-col gap-4 w-full">
      {/* Current Clue Card */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-sm xl:sticky xl:top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
              {currentDirection}
            </span>
            {activeClueObj && (
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Word {activeClueObj.number}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)} className="gap-2 text-muted-foreground hover:text-foreground">
            <List size={16} /> <span className="hidden sm:inline">All Questions</span>
          </Button>
        </div>
        
        {activeClueObj ? (
          <p className="text-base sm:text-lg font-semibold text-foreground leading-snug mt-2">
            {activeClueObj.clue}
          </p>
        ) : (
          <p className="text-base text-muted-foreground italic mt-2">Select a cell to view clue</p>
        )}
      </div>

      {/* Clues Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-none sm:rounded-3xl p-6 sm:p-8 w-full h-full sm:max-w-[calc(100vw-2rem)] lg:max-w-4xl shadow-2xl relative sm:max-h-[90vh] overflow-y-auto flex flex-col">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 pr-8">
              All Questions
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sm:p-5">
              <ClueList title="Across" clues={acrossClues} />
              <ClueList title="Down" clues={downClues} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
