export interface CrosswordTheme {
  id: string;
  name: string;
  
  // Background styles applied to the board container
  background: string;
  
  // Board styling (e.g. gaps, borders)
  board: string;
  
  // Normal cell styling
  cell: string;
  
  // Black/Empty cell styling
  blackCell: string;
  
  // Selected cell styling (glow, shadow)
  selectedCell: string;
  
  // Completed/Correct word styling
  completedCell: string;
  
  // Clue number typography inside cell
  clueNumber: string;
  
  // Hover animation classes
  hover: string;
  
  // Base typography for letters
  typography: string;
}
