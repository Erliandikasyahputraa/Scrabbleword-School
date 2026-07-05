import { useContext } from 'react';
import { CrosswordContext } from '../components/crossword/CrosswordProvider';

export function useCrossword() {
  const ctx = useContext(CrosswordContext);
  if (!ctx) {
    throw new Error('useCrossword must be used inside CrosswordProvider');
  }
  return ctx;
}
