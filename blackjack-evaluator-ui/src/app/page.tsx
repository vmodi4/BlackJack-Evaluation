"use client";
import { useState } from "react";
import { LayoutShell } from "../components/LayoutShell";
import { BlackjackTable } from "../components/BlackjackTable";
import { SessionConfigModal } from "../components/SessionConfigModal";
import { SessionChart } from "../components/SessionChart";

export default function Home() {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <LayoutShell>
      <SessionConfigModal
        open={showConfig}
        onClose={() => setShowConfig(false)}
      />
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-emerald-100">
            Blackjack Evaluator
          </h1>
          <p className="text-sm text-emerald-100/80">
            Practice basic strategy and Hi-Lo card counting with instant
            feedback.
          </p>
        </header>
        <BlackjackTable />
        <SessionChart />
      </div>
    </LayoutShell>
  );
}

