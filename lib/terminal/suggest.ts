/** Classic Levenshtein edit distance — small inputs only (command names). */
function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[rows - 1][cols - 1];
}

/** Closest known name to `input`, or null if nothing is close enough to be useful. */
export function closestMatch(input: string, candidates: string[]): string | null {
  let best: { name: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const distance = editDistance(input, candidate);
    if (!best || distance < best.distance) best = { name: candidate, distance };
  }
  if (!best) return null;
  const threshold = Math.max(2, Math.ceil(input.length / 2));
  return best.distance <= threshold ? best.name : null;
}
