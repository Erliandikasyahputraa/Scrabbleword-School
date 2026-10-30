import type { CrosswordData, CrosswordWord } from '../types/crossword';

export function getWordsAtCell(row: number, col: number, words: CrosswordWord[]): CrosswordWord[] {
  return words.filter(w => {
    if (w.direction === 'across') {
      return w.row === row && col >= w.col && col < w.col + w.length;
    } else {
      return w.col === col && row >= w.row && row < w.row + w.length;
    }
  });
}

export function buildSubmissionPayload(
  data: CrosswordData,
  userAnswers: Record<string, string>
): Record<string, string> {
  const answers: Record<string, string> = {};

  data.words.forEach((wordObj, index) => {
    let wordAnswer = '';
    for (let i = 0; i < wordObj.length; i++) {
      const r = wordObj.row + (wordObj.direction === 'down' ? i : 0);
      const c = wordObj.col + (wordObj.direction === 'across' ? i : 0);
      const cellKey = `${r}-${c}`;
      wordAnswer += userAnswers[cellKey] || ' ';
    }
    const cleanAnswer = wordAnswer.trim();
    // Simpan ke unique composite key (id_direction), index, dan standard id
    answers[`${wordObj.id}_${wordObj.direction}`] = cleanAnswer;
    answers[`idx_${index}`] = cleanAnswer;
    answers[wordObj.id] = cleanAnswer;
  });

  return answers;
}
