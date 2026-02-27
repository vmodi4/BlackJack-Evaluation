import type { Card as CardType } from "../lib/game/types";

type Props = {
  card: CardType;
  faceDown?: boolean;
};

export function Card({ card, faceDown = false }: Props) {
  if (faceDown) {
    return (
      <div className="flex h-24 w-16 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-800 shadow-md">
        <div className="h-20 w-12 rounded-md bg-emerald-900/80" />
      </div>
    );
  }

  const isRed = card.suit === "♥" || card.suit === "♦";

  return (
    <div className="flex h-24 w-16 flex-col justify-between rounded-xl border border-emerald-200 bg-white px-1.5 py-1 shadow-md">
      <div className="text-xs font-semibold">
        <span className={isRed ? "text-red-600" : "text-slate-900"}>
          {card.rank}
        </span>
      </div>
      <div
        className={`flex items-center justify-center text-lg ${
          isRed ? "text-red-600" : "text-slate-900"
        }`}
      >
        {card.suit}
      </div>
      <div className="flex justify-end text-xs font-semibold">
        <span className={isRed ? "text-red-600" : "text-slate-900"}>
          {card.rank}
        </span>
      </div>
    </div>
  );
}

