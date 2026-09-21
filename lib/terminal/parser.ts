/** Splits a command line into argv, respecting single and double quotes. */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let inToken = false;

  for (const char of input) {
    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      inToken = true;
      continue;
    }
    if (/\s/.test(char)) {
      if (inToken) {
        tokens.push(current);
        current = "";
        inToken = false;
      }
      continue;
    }
    current += char;
    inToken = true;
  }

  if (inToken) tokens.push(current);
  return tokens;
}
