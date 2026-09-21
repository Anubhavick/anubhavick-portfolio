/**
 * Lightweight fuzzy scorer — no dependency. Exact substrings score highest
 * (earlier position wins), otherwise an in-order subsequence match scores
 * lower the more the matched characters are spread out. Returns null when
 * `query`'s characters don't all appear, in order, in `target`.
 */
export function fuzzyScore(query: string, target: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = target.toLowerCase();

  const idx = t.indexOf(q);
  if (idx !== -1) {
    return 1000 - idx - Math.abs(t.length - q.length) * 0.5;
  }

  let searchFrom = 0;
  let score = 0;
  let lastMatch = -1;
  for (const ch of q) {
    const found = t.indexOf(ch, searchFrom);
    if (found === -1) return null;
    const gap = lastMatch === -1 ? found : found - lastMatch - 1;
    score += 10 - Math.min(gap, 9);
    lastMatch = found;
    searchFrom = found + 1;
  }
  return score;
}

/** Best score for `query` across several candidate strings, or null if none match. */
export function bestScore(query: string, candidates: string[]): number | null {
  let best: number | null = null;
  for (const candidate of candidates) {
    const score = fuzzyScore(query, candidate);
    if (score !== null && (best === null || score > best)) best = score;
  }
  return best;
}
