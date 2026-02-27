import type { Card, Rank, Suit } from "./types";

const RANKS: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];

export function generateDeck(numDecks: number): Card[] {
  const decks: Card[] = [];

  for (let d = 0; d < numDecks; d += 1) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        decks.push({ rank, suit });
      }
    }
  }

  return shuffle(decks);
}

export function shuffle<T>(input: T[]): T[] {
  const array = [...input];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export function drawCards<T>(
  cards: T[],
  n: number,
): { drawn: T[]; remaining: T[] } {
  const drawn = cards.slice(0, n);
  const remaining = cards.slice(n);
  return { drawn, remaining };
}

