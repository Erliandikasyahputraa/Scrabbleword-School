import { useState, useEffect } from 'react';
import { type CrosswordInputWord, generateCrosswordData } from '../../../lib/crosswordGenerator';
import { CrosswordWordInput } from './CrosswordWordInput';
import { CrosswordWordList } from './CrosswordWordList';
import { CrosswordPreview } from './CrosswordPreview';
import { CrosswordThemeSelector } from '../CrosswordThemeSelector';
import { Button } from '../../ui/Button';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EmptyCrosswordIllustration } from '../../ui/Illustrations';
import type { CrosswordData } from '../../../types/crossword';

interface CrosswordBuilderProps {
  initialData?: CrosswordData | null;
  onChange: (data: CrosswordData | null) => void;
  sidebarFooter?: React.ReactNode;
}

export function CrosswordBuilder({ initialData, onChange, sidebarFooter }: CrosswordBuilderProps) {
  const [words, setWords] = useState<CrosswordInputWord[]>([]);
  const [generatedData, setGeneratedData] = useState<CrosswordData | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing words if editing
  useEffect(() => {
    if (initialData && initialData.words && initialData.clues) {
      const loadedWords = initialData.words.map(w => {
        const clue = initialData.clues.find(c => c.id === w.id);
        return {
          word: w.word,
          clue: clue ? clue.clue : ''
        };
      });
      setWords(loadedWords);
      setGeneratedData(initialData);
    }
  }, [initialData]);

  const handleAddWord = (word: string, clue: string) => {
    if (words.some(w => w.word === word)) {
      setError(`The word "${word}" has already been added.`);
      return;
    }
    setError('');
    setWords([...words, { word, clue }]);
    setGeneratedData(null); // invalidate current layout
    onChange(null);
  };

  const handleRemoveWord = (index: number) => {
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
    setGeneratedData(null);
    onChange(null);
    setError('');
  };

  const handleGenerate = () => {
    if (words.length < 2) {
      setError('Please add at least 2 words to generate a puzzle.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    // Reset previous layout state immediately to avoid stale grid reuse
    setGeneratedData(null);
    onChange(null);
    
    // Simulate slight delay for better UX feeling of "generation"
    setTimeout(() => {
      try {
        const data = generateCrosswordData(words);
        setGeneratedData(data);
        onChange(data);
      } catch (err: any) {
        setError(err.message || 'Failed to generate layout. Try adding more crossing letters.');
        setGeneratedData(null);
        onChange(null);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col h-full space-y-6 bg-card rounded-2xl border border-border p-6 min-h-0 shadow-sm">
      <div className="border-b border-border pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-foreground">Interactive Puzzle Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">Add words and clues, then generate the layout automatically.</p>
        </div>
        <CrosswordThemeSelector />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Col: Preview (75%) */}
        <div className="lg:col-span-9 flex flex-col h-full overflow-hidden bg-muted/10 rounded-xl border border-border p-4 order-last lg:order-first">
          {generatedData ? (
            <div className="animate-in fade-in zoom-in-95 duration-300 flex-1 flex flex-col min-h-0">
               <div className="flex items-center gap-2 mb-4 shrink-0 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold text-sm">Layout Generated Successfully</span>
               </div>
               <div className="flex-1 min-h-0">
                 <CrosswordPreview data={generatedData} />
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-muted/50 border-2 border-dashed border-border rounded-2xl">
               <div className="mb-4 text-muted-foreground opacity-80">
                  <EmptyCrosswordIllustration size={100} />
               </div>
               <h3 className="text-foreground font-bold mb-2 text-lg">No Preview Available</h3>
               <p className="text-sm text-muted-foreground max-w-[280px]">
                  Add your words and click Generate to see the crossword layout here.
               </p>
            </div>
          )}
        </div>

        {/* Right Col: Words Management (25%) */}
        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden bg-muted/20 rounded-xl border border-border order-first lg:order-last">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <CrosswordWordInput onAddWord={handleAddWord} disabled={isGenerating} />
            <CrosswordWordList words={words} onRemoveWord={handleRemoveWord} disabled={isGenerating} />
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                 <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-card border-t border-border shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-3">
            <Button 
              type="button" 
              onClick={handleGenerate} 
              fullWidth 
              disabled={words.length < 2 || isGenerating}
              className="h-11 shadow-sm bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white font-semibold"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><RefreshCw size={16} className="animate-spin" /> Generating...</span>
              ) : (
                <span className="flex items-center gap-2"><RefreshCw size={16} /> {generatedData ? 'Regenerate' : 'Generate Layout'}</span>
              )}
            </Button>
            {sidebarFooter}
          </div>
        </div>
      </div>
    </div>
  );
}
