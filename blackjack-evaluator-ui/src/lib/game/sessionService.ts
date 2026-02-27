import type { RoundRecord, SessionSummary } from "./types";

export interface SessionService {
  saveSession(summary: SessionSummary, rounds: RoundRecord[]): Promise<void>;
  loadSessions(userId: string): Promise<SessionSummary[]>;
  loadSessionDetails(
    sessionId: string,
  ): Promise<{ summary: SessionSummary; rounds: RoundRecord[] } | null>;
}

export class LocalSessionService implements SessionService {
  private key = "bj_sessions_v1";

  async saveSession(summary: SessionSummary, _rounds: RoundRecord[]) {
    if (typeof window === "undefined") return;
    const existingRaw = window.localStorage.getItem(this.key);
    const existing: SessionSummary[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];
    const withoutSame = existing.filter(
      (session) => session.sessionId !== summary.sessionId,
    );
    window.localStorage.setItem(
      this.key,
      JSON.stringify([...withoutSame, summary]),
    );
  }

  async loadSessions(_userId: string): Promise<SessionSummary[]> {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SessionSummary[];
    } catch {
      return [];
    }
  }

  async loadSessionDetails(
    sessionId: string,
  ): Promise<{ summary: SessionSummary; rounds: RoundRecord[] } | null> {
    const sessions = await this.loadSessions("");
    const summary = sessions.find((s) => s.sessionId === sessionId);
    if (!summary) return null;
    return { summary, rounds: [] };
  }
}

