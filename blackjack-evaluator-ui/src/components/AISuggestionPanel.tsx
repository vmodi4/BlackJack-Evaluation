"use client";

import { useGameStore } from "../store/useGameStore";

const LABELS: Record<string, string> = {
  hit: "Hit",
  stand: "Stand",
  double: "Double",
  split: "Split",
};

export function AISuggestionPanel() {
  const currentSuggestion = useGameStore((state) => state.currentSuggestion);
  const lastAction = useGameStore((state) => state.lastAction);
  const lastWasCorrectPlay = useGameStore((state) => state.lastWasCorrectPlay);
  const runningCount = useGameStore((state) => state.runningCount);
  const trueCount = useGameStore((state) => state.trueCount);

  const suggestionLabel =
    currentSuggestion != null ? LABELS[currentSuggestion] : "—";
  const lastActionLabel = lastAction ? LABELS[lastAction] : "—";

  let feedback: string | null = null;
  if (lastWasCorrectPlay === true) feedback = "Nice play. You matched basic strategy.";
  if (lastWasCorrectPlay === false)
    feedback = "This deviated from basic strategy. Review the chart for this spot.";

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-emerald-900/70 p-4 text-sm">
      <h2 className="text-base font-semibold text-emerald-100">
        AI Suggestion
      </h2>
      <div>
        <div className="text-xs text-emerald-200/80">Current hand</div>
        <div className="mt-1 text-2xl font-bold text-emerald-300">
          {suggestionLabel}
        </div>
      </div>
      <div className="mt-2 border-t border-emerald-700/60 pt-2">
        <div className="text-xs text-emerald-200/80">Your last action</div>
        <div className="mt-1 text-base font-semibold text-emerald-100">
          {lastActionLabel}
        </div>
        {feedback && (
          <p className="mt-1 text-xs text-emerald-200/80">{feedback}</p>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-1 border-t border-emerald-700/60 pt-2 text-xs text-emerald-200/80">
        <div>Running count: {runningCount}</div>
        <div>True count (approx): {trueCount}</div>
      </div>
    </div>
  );
}

