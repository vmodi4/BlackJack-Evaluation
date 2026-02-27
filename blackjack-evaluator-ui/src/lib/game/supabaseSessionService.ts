import type { SessionService } from "./sessionService";
import type { RoundRecord, SessionSummary } from "./types";
import { supabase } from "../supabaseClient";

export class SupabaseSessionService implements SessionService {
  async saveSession(summary: SessionSummary, rounds: RoundRecord[]) {
    if (!supabase) return;

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    const { sessionId, ...rest } = summary;

    const { data: inserted, error } = await supabase
      .from("sessions")
      .insert({
        id: sessionId,
        user_id: userId,
        started_at: summary.startedAt,
        ended_at: summary.endedAt,
        starting_balance: summary.startingBalance,
        ending_balance: summary.endingBalance,
        num_decks: summary.numDecks,
        total_hands: summary.totalHands,
        correct_play_rate: summary.correctPlayRate,
        win_rate: summary.winRate,
        bankroll_series: summary.bankrollSeries,
        metadata: rest,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      // eslint-disable-next-line no-console
      console.error("Failed to save session", error);
      return;
    }

    if (rounds.length === 0) return;

    const rows = rounds.map((round) => ({
      session_id: sessionId,
      hand_index: round.handIndex,
      bet: round.bet,
      outcome: round.outcome,
      bankroll_after: round.bankrollAfter,
      running_count_after: round.runningCountAfter,
      true_count_after: round.trueCountAfter,
      basic_suggestion: round.basicSuggestion,
      player_action: round.playerAction,
      was_correct_play: round.wasCorrectPlay,
    }));

    const { error: roundsError } = await supabase
      .from("session_rounds")
      .insert(rows);

    if (roundsError) {
      // eslint-disable-next-line no-console
      console.error("Failed to save session rounds", roundsError);
    }
  }

  async loadSessions(userId: string): Promise<SessionSummary[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    if (error || !data) {
      // eslint-disable-next-line no-console
      console.error("Failed to load sessions", error);
      return [];
    }

    return data.map((row) => ({
      sessionId: row.id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      startingBalance: row.starting_balance,
      endingBalance: row.ending_balance,
      numDecks: row.num_decks,
      totalHands: row.total_hands,
      correctPlayRate: Number(row.correct_play_rate),
      winRate: Number(row.win_rate),
      bankrollSeries: row.bankroll_series ?? [],
    }));
  }

  async loadSessionDetails(
    sessionId: string,
  ): Promise<{ summary: SessionSummary; rounds: RoundRecord[] } | null> {
    if (!supabase) return null;

    const { data: session, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      // eslint-disable-next-line no-console
      console.error("Failed to load session", error);
      return null;
    }

    const { data: rounds, error: roundsError } = await supabase
      .from("session_rounds")
      .select("*")
      .eq("session_id", sessionId)
      .order("hand_index", { ascending: true });

    if (roundsError || !rounds) {
      // eslint-disable-next-line no-console
      console.error("Failed to load session rounds", roundsError);
      return null;
    }

    const summary: SessionSummary = {
      sessionId: session.id,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      startingBalance: session.starting_balance,
      endingBalance: session.ending_balance,
      numDecks: session.num_decks,
      totalHands: session.total_hands,
      correctPlayRate: Number(session.correct_play_rate),
      winRate: Number(session.win_rate),
      bankrollSeries: session.bankroll_series ?? [],
    };

    const mappedRounds: RoundRecord[] = rounds.map((row, index) => ({
      roundId: `${sessionId}-${index}`,
      handIndex: row.hand_index,
      bet: row.bet,
      outcome: row.outcome,
      bankrollAfter: row.bankroll_after,
      runningCountAfter: row.running_count_after,
      trueCountAfter: Number(row.true_count_after ?? 0),
      basicSuggestion: row.basic_suggestion,
      playerAction: row.player_action,
      wasCorrectPlay: row.was_correct_play,
    }));

    return { summary, rounds: mappedRounds };
  }
}

