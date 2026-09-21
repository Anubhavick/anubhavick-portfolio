export type SearchResultKind = "app" | "project" | "experience" | "file" | "stack";

export interface SearchEntry {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle?: string;
  /** Extra terms matched against but not shown, e.g. stack tags, app id. */
  keywords: string[];
  icon: string;
  run: () => void;
}

export interface ScoredEntry {
  entry: SearchEntry;
  score: number;
}
