"use client";

import { useGameStore } from "../store/useGameStore";

export function ControlsPanel() {
  const phase = useGameStore((state) => state.phase);
  const bankroll = useGameStore((state) => state.bankroll);
  const currentBet = useGameStore((state) => state.currentBet);
  const setBet = useGameStore((state) => state.setBet);
  const startRound = useGameStore((state) => state.startRound);
  const hit = useGameStore((state) => state.hit);
  const stand = useGameStore((state) => state.stand);
  const double = useGameStore((state) => state.double);
  const endRound = useGameStore((state) => state.endRound);

  const canDeal = phase === "idle" && currentBet > 0 && currentBet <= bankroll;
  const canAct = phase === "playerTurn";
  const canEndRound = phase === "roundResult";

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-emerald-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-emerald-100">
          <div>Bankroll: ${bankroll}</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Bet</span>
          <input
            type="number"
            min={0}
            step={5}
            value={currentBet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="h-8 w-24 rounded-md border border-emerald-500 bg-emerald-950/50 px-2 text-sm text-emerald-50 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <button
          type="button"
          onClick={startRound}
          disabled={!canDeal}
          className="rounded-lg bg-emerald-500 py-2 font-semibold text-emerald-950 shadow disabled:cursor-not-allowed disabled:bg-emerald-700/40"
        >
          Deal
        </button>
        <button
          type="button"
          onClick={endRound}
          disabled={!canEndRound}
          className="rounded-lg bg-slate-700 py-2 font-semibold text-slate-100 shadow disabled:cursor-not-allowed disabled:bg-slate-700/40"
        >
          Next Hand
        </button>
        <button
          type="button"
          onClick={hit}
          disabled={!canAct}
          className="rounded-lg bg-emerald-400 py-2 font-semibold text-emerald-950 shadow disabled:cursor-not-allowed disabled:bg-emerald-700/40"
        >
          Hit
        </button>
        <button
          type="button"
          onClick={stand}
          disabled={!canAct}
          className="rounded-lg bg-amber-400 py-2 font-semibold text-amber-950 shadow disabled:cursor-not-allowed disabled:bg-amber-700/40"
        >
          Stand
        </button>
        <button
          type="button"
          onClick={double}
          disabled={!canAct || currentBet * 2 > bankroll}
          className="col-span-2 rounded-lg bg-indigo-400 py-2 font-semibold text-indigo-950 shadow disabled:cursor-not-allowed disabled:bg-indigo-800/40"
        >
          Double
        </button>
      </div>
    </div>
  );
}

