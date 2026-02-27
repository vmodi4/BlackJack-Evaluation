"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGameStore } from "../store/useGameStore";
import { buildBankrollSeries } from "../lib/game/analytics";

export function SessionChart() {
  const rounds = useGameStore((state) => state.rounds);

  if (rounds.length === 0) {
    return (
      <div className="rounded-2xl bg-emerald-900/60 p-4 text-sm text-emerald-200/80">
        Play some hands to see your bankroll trajectory.
      </div>
    );
  }

  const data = buildBankrollSeries(rounds);

  return (
    <div className="rounded-2xl bg-emerald-900/60 p-4">
      <h2 className="mb-2 text-sm font-semibold text-emerald-100">
        Bankroll over time
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#064e3b"
              vertical={false}
            />
            <XAxis
              dataKey="handIndex"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a7f3d0", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a7f3d0", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#022c22",
                border: "1px solid #059669",
                borderRadius: "0.5rem",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="bankroll"
              stroke="#6ee7b7"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

