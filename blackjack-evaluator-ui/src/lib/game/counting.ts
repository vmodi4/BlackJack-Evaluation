import type { Card } from "./types";

export function getHiLoValue(card: Card): number {
  const rank = card.rank;

  if (["2", "3", "4", "5", "6"].includes(rank)) return 1;
  if (["7", "8", "9"].includes(rank)) return 0;
  return -1; // 10, J, Q, K, A
}

export function updateRunningCount(prev: number, dealt: Card[]): number {
  return dealt.reduce((acc, card) => acc + getHiLoValue(card), prev);
}

export function estimateTrueCount(
  runningCount: number,
  cardsDealt: number,
  numDecks: number,
): number {
  const decksUsed = cardsDealt / 52;
  const decksRemaining = Math.max(numDecks - decksUsed, 0.25);
  return Number((runningCount / decksRemaining).toFixed(2));
}

