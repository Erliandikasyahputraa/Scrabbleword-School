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

export function generateCrossword(inputWords: CrosswordInputWord[]): PlacedWord[] {
  if (inputWords.length === 0) return [];

  // Filter out empty words, trim, uppercase
  const words = inputWords
    .map(w => ({ word: w.word.trim().toUpperCase(), clue: w.clue.trim() }))
    .filter(w => w.word.length > 0)
    .sort((a, b) => b.word.length - a.word.length);

  if (words.length === 0) return [];

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
    let bestIntersection: { row: number; col: number; direction: 'across' | 'down'; score: number } | null = null;

    // Search for intersections with already placed words
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
              // Score could be based on bounding box size (keep it small)
              // For simplicity, just take the first valid one
              bestIntersection = { row: proposedRow, col: proposedCol, direction: proposedDir, score: 0 };
              break; // Found one valid placement for this character
            }
          }
        }
        if (bestIntersection) break;
      }
      if (bestIntersection) break;
    }

    if (!bestIntersection) {
      throw new Error(`Could not find a valid intersection for the word: ${current.word}`);
    }

    // Place it
    placed.push({
      id: `temp-${wIdx}`,
      word: current.word,
      clue: current.clue,
      row: bestIntersection.row,
      col: bestIntersection.col,
      direction: bestIntersection.direction,
      length: current.word.length
    });

    for (let i = 0; i < current.word.length; i++) {
      const r = bestIntersection.direction === 'down' ? bestIntersection.row + i : bestIntersection.row;
      const c = bestIntersection.direction === 'across' ? bestIntersection.col + i : bestIntersection.col;
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
