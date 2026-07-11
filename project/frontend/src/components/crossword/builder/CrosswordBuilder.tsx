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
  mainHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

export function CrosswordBuilder({ initialData, onChange, mainHeader, sidebarFooter }: CrosswordBuilderProps) {
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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 xl:gap-8 w-full">
      {/* Left Column: Editor Workspace (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6 w-full">
        {mainHeader && (
          <div className="w-full">
            {mainHeader}
          </div>
        )}

        {/* Preview Panel is now the only thing in the left column */}

        {/* Preview Panel */}
        <div className="w-full flex flex-col bg-muted/10 rounded-2xl border border-border p-4 sm:p-6 shadow-sm overflow-hidden min-h-[400px] md:min-h-[500px]">
          {generatedData ? (
            <div className="animate-in fade-in zoom-in-95 duration-300 w-full flex flex-col flex-1">
               <div className="flex items-center justify-between mb-4 shrink-0 bg-card p-3 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 size={18} />
                    <span className="font-semibold text-sm">Layout Generated Successfully</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                     <span>{generatedData.grid.cols} × {generatedData.grid.rows} Grid</span>
                     <span>{generatedData.words.length} Words</span>
                  </div>
               </div>
               <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[300px]">
                 <CrosswordPreview data={generatedData} />
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30 border-2 border-dashed border-border/60 rounded-xl h-full min-h-[300px]">
               <div className="mb-4 text-muted-foreground opacity-60">
                  <EmptyCrosswordIllustration size={120} />
               </div>
               <h3 className="text-foreground font-bold mb-2 text-xl">No Preview Available</h3>
               <p className="text-sm text-muted-foreground max-w-sm">
                  Add words using the form above, then click Generate to see your interactive crossword layout here.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Tools (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 self-start w-full">
        
        {/* Add Word */}
        <div className="bg-card border border-border p-4 sm:p-5 rounded-2xl shadow-sm w-full">
          <h3 className="text-base font-bold text-foreground flex items-center justify-between mb-4">
            <span>Add Word</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">{words.length} words added</span>
          </h3>
          <CrosswordWordInput onAddWord={handleAddWord} disabled={isGenerating} />
        </div>

        {/* Theme Gallery (Mini) */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-5">
          <CrosswordThemeSelector />
        </div>

        {/* Word List */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col min-h-0">
          <h3 className="text-base font-bold text-foreground mb-4">Word List</h3>
          <div className="flex-1 w-full min-h-[150px]">
            <CrosswordWordList words={words} onRemoveWord={handleRemoveWord} disabled={isGenerating} />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2 animate-in slide-in-from-top-2 mt-4 shrink-0">
               <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Generate */}
        <Button 
          type="button" 
          onClick={handleGenerate} 
          fullWidth 
          disabled={words.length < 2 || isGenerating}
          className="h-12 shadow-sm font-bold text-base bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary/90 text-white rounded-xl"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2"><RefreshCw size={18} className="animate-spin" /> Generating...</span>
          ) : (
            <span className="flex items-center gap-2"><RefreshCw size={18} /> {generatedData ? 'Regenerate Layout' : 'Generate Layout'}</span>
          )}
        </Button>

        {/* Removed duplicate Theme Gallery as it is now above Word List */}

        {/* Save Footer */}
        {sidebarFooter && (
          <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-5 mt-2">
            {sidebarFooter}
          </div>
        )}
      </div>
    </div>
  );
}
