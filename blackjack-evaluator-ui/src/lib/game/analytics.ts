import type { BankrollPoint, RoundRecord, SessionSummary } from "./types";

export function buildBankrollSeries(rounds: RoundRecord[]): BankrollPoint[] {
  return rounds.map((round) => ({
    handIndex: round.handIndex,
    bankroll: round.bankrollAfter,
  }));
}

export function computeWinRate(rounds: RoundRecord[]): number {
  if (rounds.length === 0) return 0;
  const wins = rounds.filter((r) => r.outcome === "win").length;
  return wins / rounds.length;
}

export function computeCorrectPlayRate(rounds: RoundRecord[]): number {
  if (rounds.length === 0) return 0;
  const correct = rounds.filter((r) => r.wasCorrectPlay).length;
  return correct / rounds.length;
}

export function computeEndingBalance(
  rounds: RoundRecord[],
  startingBalance: number,
): number {
  if (rounds.length === 0) return startingBalance;
  return rounds[rounds.length - 1].bankrollAfter;
}

export function buildSessionSummary(
  sessionId: string,
  startedAt: Date,
  endedAt: Date,
  startingBalance: number,
  numDecks: number,
  rounds: RoundRecord[],
): SessionSummary {
  const totalHands = rounds.length;
  const winRate = computeWinRate(rounds);
  const correctPlayRate = computeCorrectPlayRate(rounds);
  const endingBalance = computeEndingBalance(rounds, startingBalance);
  const bankrollSeries = buildBankrollSeries(rounds);

  return {
    sessionId,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    startingBalance,
    endingBalance,
    numDecks,
    totalHands,
    correctPlayRate,
    winRate,
    bankrollSeries,
  };
}

