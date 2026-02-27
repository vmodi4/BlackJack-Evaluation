"use client";

import { useState } from "react";
import type { SessionConfig } from "../lib/game/types";
import { useGameStore } from "../store/useGameStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SessionConfigModal({ open, onClose }: Props) {
  const startSession = useGameStore((state) => state.startSession);

  const [startingBalance, setStartingBalance] = useState(1000);
  const [numDecks, setNumDecks] = useState(6);
  const [minBet, setMinBet] = useState(10);
  const [maxBet, setMaxBet] = useState(500);

  if (!open) return null;

  const handleStart = () => {
    const config: SessionConfig = {
      startingBalance,
      numDecks,
      minBet,
      maxBet,
    };
    startSession(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-emerald-950 p-6 shadow-2xl ring-1 ring-emerald-700/70">
        <h2 className="text-lg font-semibold text-emerald-100">
          Start Training Session
        </h2>
        <p className="mt-1 text-sm text-emerald-200/80">
          Configure your bankroll and table before you begin.
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <label className="flex flex-col gap-1">
            <span>Starting balance</span>
            <input
              type="number"
              min={100}
              step={50}
              value={startingBalance}
              onChange={(e) => setStartingBalance(Number(e.target.value))}
              className="h-9 rounded-md border border-emerald-600 bg-emerald-950/40 px-2 text-emerald-50 outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Number of decks</span>
            <input
              type="number"
              min={1}
              max={8}
              value={numDecks}
              onChange={(e) => setNumDecks(Number(e.target.value))}
              className="h-9 rounded-md border border-emerald-600 bg-emerald-950/40 px-2 text-emerald-50 outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span>Min bet</span>
              <input
                type="number"
                min={5}
                step={5}
                value={minBet}
                onChange={(e) => setMinBet(Number(e.target.value))}
                className="h-9 rounded-md border border-emerald-600 bg-emerald-950/40 px-2 text-emerald-50 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Max bet</span>
              <input
                type="number"
                min={minBet}
                step={25}
                value={maxBet}
                onChange={(e) => setMaxBet(Number(e.target.value))}
                className="h-9 rounded-md border border-emerald-600 bg-emerald-950/40 px-2 text-emerald-50 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-emerald-100 hover:bg-emerald-900/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="rounded-md bg-emerald-500 px-3 py-1.5 font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}

