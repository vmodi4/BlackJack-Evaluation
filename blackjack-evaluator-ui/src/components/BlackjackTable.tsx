"use client";

import { Card } from "./Card";
import { ControlsPanel } from "./ControlsPanel";
import { AISuggestionPanel } from "./AISuggestionPanel";
import { useGameStore } from "../store/useGameStore";

export function BlackjackTable() {
  const playerHand = useGameStore((state) => state.playerHand);
  const dealerHand = useGameStore((state) => state.dealerHand);
  const phase = useGameStore((state) => state.phase);
  const bankroll = useGameStore((state) => state.bankroll);

  const statusText = (() => {
    if (!playerHand && !dealerHand) return "Set your bet and deal a new hand.";
    if (phase === "playerTurn") return "Your move. Follow the suggestion or practice deviations.";
    if (phase === "dealerTurn") return "Dealer playing out the hand...";
    if (phase === "roundResult") {
      const last = playerHand;
      if (!last) return "Hand complete.";
      if (last.isBusted) return "You busted this hand.";
      return "Hand complete. Check the result and start the next hand.";
    }
    return "Ready for the next hand.";
  })();

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-900 to-emerald-950 p-4 ring-1 ring-emerald-700/60">
          <div className="mb-3 flex items-center justify-between text-xs text-emerald-100/90">
            <span>Dealer</span>
            <span>
              Bankroll: <span className="font-semibold">${bankroll}</span>
            </span>
          </div>

          <div className="mb-6 flex min-h-[5.5rem] items-center gap-2">
            {dealerHand ? (
              dealerHand.cards.map((card, idx) => (
                <Card
                  // All dealer cards are face up for training.
                  key={`${card.rank}-${card.suit}-${idx}`}
                  card={card}
                  faceDown = {idx > 0 && phase === "playerTurn"}
                />
              ))
            ) : (
              <span className="text-xs text-emerald-200/70">
                Dealer cards will appear here.
              </span>
            )}
          </div>

          <div className="mb-2 text-xs text-emerald-100/80">Player</div>
          <div className="flex min-h-[5.5rem] items-center gap-2">
            {playerHand ? (
              playerHand.cards.map((card, idx) => (
                <Card
                  key={`${card.rank}-${card.suit}-${idx}`}
                  card={card}
                />
              ))
            ) : (
              <span className="text-xs text-emerald-200/70">
                Your cards will appear here.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-900/70 p-4 text-sm text-emerald-100/90">
          {statusText}
        </div>

        <ControlsPanel />
      </div>

      <AISuggestionPanel />
    </div>
  );
}

