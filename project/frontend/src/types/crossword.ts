export type CrosswordDirection = 'across' | 'down';

export type CrosswordWord = {
  id: string;
  word: string;
  row: number;
  col: number;
  direction: CrosswordDirection;
  length: number;
};

export type CrosswordClue = {
  id: string;
  number: number;
  direction: CrosswordDirection;
  clue: string;
};

export type CrosswordMetadata = {
  title: string;
  difficulty: string;
  estimated_time: number;
  max_hints: number;
};

export type CrosswordData = {
  metadata: CrosswordMetadata;
  grid: {
    rows: number;
    cols: number;
  };
  words: CrosswordWord[];
  clues: CrosswordClue[];
};
