import type { Card, Hand, PlayerAction } from "./types";

// Simplified basic strategy chart for hard totals only.
// This can be expanded later with soft totals and pairs.

const hardTotals: Record<number, Partial<Record<string, PlayerAction>>> = {
  8: {
    "2": "hit",
    "3": "hit",
    "4": "hit",
    "5": "hit",
    "6": "hit",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  9: {
    "2": "hit",
    "3": "double",
    "4": "double",
    "5": "double",
    "6": "double",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  10: {
    "2": "double",
    "3": "double",
    "4": "double",
    "5": "double",
    "6": "double",
    "7": "double",
    "8": "double",
    "9": "double",
    "10": "hit",
    A: "hit",
  },
  11: {
    "2": "double",
    "3": "double",
    "4": "double",
    "5": "double",
    "6": "double",
    "7": "double",
    "8": "double",
    "9": "double",
    "10": "double",
    A: "hit",
  },
  12: {
    "2": "hit",
    "3": "hit",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  13: {
    "2": "stand",
    "3": "stand",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  14: {
    "2": "stand",
    "3": "stand",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  15: {
    "2": "stand",
    "3": "stand",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  16: {
    "2": "stand",
    "3": "stand",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "hit",
    "8": "hit",
    "9": "hit",
    "10": "hit",
    A: "hit",
  },
  17: {
    "2": "stand",
    "3": "stand",
    "4": "stand",
    "5": "stand",
    "6": "stand",
    "7": "stand",
    "8": "stand",
    "9": "stand",
    "10": "stand",
    A: "stand",
  },
};

export function getBasicStrategySuggestion(
  player: Hand,
  dealerUpcard: Card,
  canDouble: boolean,
  _canSplit: boolean,
): PlayerAction {
  const dealerRank = dealerUpcard.rank;
  const total = player.total;

  if (total <= 7) return "hit";
  if (total >= 18) return "stand";

  const row = hardTotals[total];
  if (!row) return total >= 17 ? "stand" : "hit";

  const action = row[dealerRank];
  if (!action) {
    return total >= 17 ? "stand" : "hit";
  }

  if (action === "double" && !canDouble) {
    return "hit";
  }

  return action;
}

