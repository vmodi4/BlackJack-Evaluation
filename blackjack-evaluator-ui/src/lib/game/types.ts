export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type Suit = "♠" | "♥" | "♦" | "♣";

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface Hand {
  cards: Card[];
  total: number;
  isSoft: boolean;
  isBusted: boolean;
  isBlackjack: boolean;
}

export type GamePhase = "idle" | "playerTurn" | "dealerTurn" | "roundResult";

export type Outcome = "win" | "loss" | "push";

export type PlayerAction = "hit" | "stand" | "double" | "split";

export interface SessionConfig {
  startingBalance: number;
  numDecks: number;
  minBet: number;
  maxBet: number;
}

export interface RoundRecord {
  roundId: string;
  handIndex: number;
  bet: number;
  outcome: Outcome;
  bankrollAfter: number;
  runningCountAfter: number;
  trueCountAfter: number;
  basicSuggestion: PlayerAction;
  playerAction: PlayerAction;
  wasCorrectPlay: boolean;
}

export interface BankrollPoint {
  handIndex: number;
  bankroll: number;
}

export interface SessionSummary {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  startingBalance: number;
  endingBalance: number;
  numDecks: number;
  totalHands: number;
  correctPlayRate: number;
  winRate: number;
  bankrollSeries: BankrollPoint[];
}

