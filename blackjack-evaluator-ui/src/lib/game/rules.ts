import type { Card, Hand, Outcome } from "./types";

export function calculateHand(cards: Card[]): Hand {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      total += 11;
    } else if (["K", "Q", "J", "10"].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const isSoft =
    cards.some((card) => card.rank === "A") && total <= 21 && aces > 0;
  const isBusted = total > 21;
  const isBlackjack = cards.length === 2 && total === 21;

  return {
    cards,
    total,
    isSoft,
    isBusted,
    isBlackjack,
  };
}

export function shouldDealerHit(hand: Hand): boolean {
  if (hand.isBusted) return false;
  if (hand.total < 17) return true;
  if (hand.total === 17 && hand.isSoft) {
    return true;
  }
  return false;
}

export function resolveOutcome(
  player: Hand,
  dealer: Hand,
  bet: number,
): { outcome: Outcome; delta: number } {
  if (player.isBusted) {
    return { outcome: "loss", delta: -bet };
  }

  if (dealer.isBusted) {
    return { outcome: "win", delta: bet };
  }

  if (player.total > dealer.total) {
    return { outcome: "win", delta: bet };
  }

  if (player.total < dealer.total) {
    return { outcome: "loss", delta: -bet };
  }

  return { outcome: "push", delta: 0 };
}

