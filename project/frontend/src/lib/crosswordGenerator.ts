export interface CrosswordInputWord {
  word: string;
  clue: string;
}

export interface PlacedWord {
  id: string;
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  length: number;
  number?: number;
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function generateCrossword(inputWords: CrosswordInputWord[]): PlacedWord[] {
  if (inputWords.length === 0) return [];

  // Filter out empty words, trim, uppercase
  const words = inputWords
    .map(w => ({ word: w.word.trim().toUpperCase(), clue: w.clue.trim() }))
    .filter(w => w.word.length > 0)
    .sort((a, b) => b.word.length - a.word.length); // Start by sorting longest first

  if (words.length === 0) return [];

  const maxAttempts = 50;
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return attemptGeneration(words, attempt);
    } catch (e: any) {
      lastError = e;
      // Continue to next attempt
    }
  }
  
  throw new Error(lastError?.message || "Unable to generate a valid crossword layout after 50 attempts. Try adding words with more common intersecting letters.");
}

function attemptGeneration(
  originalWords: { word: string; clue: string }[],
  attempt: number
): PlacedWord[] {
  let words = [...originalWords];
  
  // Attempt 0 uses strictly longest-first. 
  // Subsequent attempts introduce randomness to word order.
  if (attempt > 0) {
    words = shuffleArray(words);
  }

  const placed: PlacedWord[] = [];
  const grid = new Map<string, string>(); // 'row,col' => 'A'

  // Place first word horizontally at 0,0
  const first = words[0];
  placed.push({
    id: `temp-0`,
    word: first.word,
    clue: first.clue,
    row: 0,
    col: 0,
    direction: 'across',
    length: first.word.length
  });

  for (let i = 0; i < first.word.length; i++) {
    grid.set(`0,${i}`, first.word[i]);
  }

  // Attempt to place remaining words
  for (let wIdx = 1; wIdx < words.length; wIdx++) {
    const current = words[wIdx];
    let bestIntersections: { row: number; col: number; direction: 'across' | 'down'; score: number }[] = [];

    // Search for intersections with ALL already placed words to find ALL possible valid spots
    for (const p of placed) {
      for (let i = 0; i < current.word.length; i++) {
        const charToMatch = current.word[i];

        for (let j = 0; j < p.word.length; j++) {
          if (p.word[j] === charToMatch) {
            // Potential intersection!
            const proposedDir = p.direction === 'across' ? 'down' : 'across';
            const proposedRow = p.direction === 'across' ? p.row - i : p.row + j;
            const proposedCol = p.direction === 'across' ? p.col + j : p.col - i;

            if (isValidPlacement(current.word, proposedRow, proposedCol, proposedDir, grid)) {
              // Calculate score: how many intersections does this placement create in total?
              const score = calculateIntersections(current.word, proposedRow, proposedCol, proposedDir, grid);
              bestIntersections.push({ row: proposedRow, col: proposedCol, direction: proposedDir, score });
            }
          }
        }
      }
    }

    if (bestIntersections.length === 0) {
      throw new Error(`Could not find a valid intersection for the word: ${current.word}`);
    }

    // Sort by best score (most intersections) descending
    bestIntersections.sort((a, b) => b.score - a.score);
    
    // Pick the best one. If there are ties for the best score, pick randomly among them to vary layouts.
    const highestScore = bestIntersections[0].score;
    const topChoices = bestIntersections.filter(i => i.score === highestScore);
    const chosen = topChoices[Math.floor(Math.random() * topChoices.length)];

    // Place it
    placed.push({
      id: `temp-${wIdx}`,
      word: current.word,
      clue: current.clue,
      row: chosen.row,
      col: chosen.col,
      direction: chosen.direction,
      length: current.word.length
    });

    for (let i = 0; i < current.word.length; i++) {
      const r = chosen.direction === 'down' ? chosen.row + i : chosen.row;
      const c = chosen.direction === 'across' ? chosen.col + i : chosen.col;
      grid.set(`${r},${c}`, current.word[i]);
    }
  }

  // Normalize grid to start at (0,0)
  let minRow = Infinity;
  let minCol = Infinity;
  for (const p of placed) {
    if (p.row < minRow) minRow = p.row;
    if (p.col < minCol) minCol = p.col;
  }

  const normalized = placed.map(p => ({
    ...p,
    row: p.row - minRow,
    col: p.col - minCol
  }));

  // Auto numbering
  // Sort by row, then by col
  normalized.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  let currentNumber = 1;
  const positions = new Map<string, number>();

  for (const p of normalized) {
    const key = `${p.row},${p.col}`;
    if (positions.has(key)) {
      p.number = positions.get(key);
    } else {
      p.number = currentNumber++;
      positions.set(key, p.number);
    }
    p.id = (p.number ?? 0).toString(); // standard id format
  }

  return normalized;
}

function calculateIntersections(
  word: string,
  startRow: number,
  startCol: number,
  direction: 'across' | 'down',
  grid: Map<string, string>
): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'down' ? startRow + i : startRow;
    const c = direction === 'across' ? startCol + i : startCol;
    if (grid.has(`${r},${c}`)) {
      count++;
    }
  }
  return count;
}

function isValidPlacement(
  word: string,
  startRow: number,
  startCol: number,
  direction: 'across' | 'down',
  grid: Map<string, string>
): boolean {
  // Check the cell before the word
  if (direction === 'across' && hasCell(grid, startRow, startCol - 1)) return false;
  if (direction === 'down' && hasCell(grid, startRow - 1, startCol)) return false;

  // Check the cell after the word
  if (direction === 'across' && hasCell(grid, startRow, startCol + word.length)) return false;
  if (direction === 'down' && hasCell(grid, startRow + word.length, startCol)) return false;

  for (let i = 0; i < word.length; i++) {
    const r = direction === 'down' ? startRow + i : startRow;
    const c = direction === 'across' ? startCol + i : startCol;

    const existingChar = grid.get(`${r},${c}`);
    if (existingChar && existingChar !== word[i]) {
      return false; // Collision with a different letter
    }

    if (!existingChar) {
      // If we are placing a new letter, it must not have adjacent letters perpendicular to the word direction
      // (This prevents parallel touching words forming invalid crosswords)
      if (direction === 'across') {
        if (hasCell(grid, r - 1, c) || hasCell(grid, r + 1, c)) return false;
      } else {
        if (hasCell(grid, r, c - 1) || hasCell(grid, r, c + 1)) return false;
      }
    }
  }

  return true;
}

function hasCell(grid: Map<string, string>, r: number, c: number): boolean {
  return grid.has(`${r},${c}`);
}

export function generateCrosswordData(
  inputWords: CrosswordInputWord[],
  title: string = "Generated Crossword"
) {
  const placedWords = generateCrossword(inputWords);
  
  if (placedWords.length === 0) {
    throw new Error("Cannot generate crossword with no words.");
  }

  let maxRow = 0;
  let maxCol = 0;

  const words: any[] = [];
  const clues: any[] = [];

  for (const pw of placedWords) {
    if (pw.direction === 'down' && pw.row + pw.length > maxRow) maxRow = pw.row + pw.length;
    if (pw.direction === 'across' && pw.row + 1 > maxRow) maxRow = pw.row + 1;
    if (pw.direction === 'across' && pw.col + pw.length > maxCol) maxCol = pw.col + pw.length;
    if (pw.direction === 'down' && pw.col + 1 > maxCol) maxCol = pw.col + 1;

    words.push({
      id: pw.id,
      word: pw.word,
      row: pw.row,
      col: pw.col,
      direction: pw.direction,
      length: pw.length
    });

    clues.push({
      id: pw.id,
      number: pw.number,
      direction: pw.direction,
      clue: pw.clue
    });
  }

  const difficulty = placedWords.length <= 5 ? "Easy" : placedWords.length <= 10 ? "Medium" : "Hard";
  // 1 minute per word roughly
  const estimatedTime = placedWords.length * 60; 

  return {
    metadata: {
      title,
      difficulty,
      estimated_time: estimatedTime,
      max_hints: Math.max(1, Math.floor(placedWords.length / 2))
    },
    grid: {
      rows: maxRow,
      cols: maxCol
    },
    words,
    clues
  };
}
