export interface WorkspaceThemeTokens {
  primary: string;
  accent: string;
  hover: string;
  ring: string;
  shadow: string;
}

export interface WorkspaceTheme {
  id: string;
  nameKey: string;
  descriptionKey: string;
  image: string;
  tokens: WorkspaceThemeTokens;
}
