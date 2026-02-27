import { create } from "zustand";
import type {
  Card,
  GamePhase,
  Hand,
  PlayerAction,
  RoundRecord,
  SessionConfig,
} from "../lib/game/types";
import { generateDeck, drawCards } from "../lib/game/deck";
import {
  calculateHand,
  resolveOutcome,
  shouldDealerHit,
} from "../lib/game/rules";
import { getBasicStrategySuggestion } from "../lib/game/basicStrategy";
import {
  estimateTrueCount,
  updateRunningCount,
} from "../lib/game/counting";
import { buildSessionSummary } from "../lib/game/analytics";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

interface GameState {
  // config & session
  sessionConfig: SessionConfig | null;
  sessionId: string | null;
  isSessionActive: boolean;
  sessionStartedAt: Date | null;

  // shoe / cards
  shoe: Card[];
  cardsDealt: number;

  // hands
  playerHand: Hand | null;
  dealerHand: Hand | null;
  phase: GamePhase;

  // betting / bankroll
  startingBalance: number;
  bankroll: number;
  currentBet: number;

  // counting
  runningCount: number;
  trueCount: number;

  // session history
  rounds: RoundRecord[];

  // suggestion / feedback
  currentSuggestion: PlayerAction | null;
  lastAction: PlayerAction | null;
  lastWasCorrectPlay: boolean | null;

  // actions
  setBet: (bet: number) => void;
  startSession: (config: SessionConfig) => void;
  startRound: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  endRound: () => void;
  endSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  sessionConfig: null,
  sessionId: null,
  isSessionActive: false,
  sessionStartedAt: null,

  shoe: [],
  cardsDealt: 0,

  playerHand: null,
  dealerHand: null,
  phase: "idle",

  startingBalance: 0,
  bankroll: 0,
  currentBet: 0,

  runningCount: 0,
  trueCount: 0,

  rounds: [],

  currentSuggestion: null,
  lastAction: null,
  lastWasCorrectPlay: null,

  setBet(bet) {
    set((state) => ({
      ...state,
      currentBet: Math.max(0, Math.floor(bet)),
    }));
  },

  startSession(config) {
    const sessionId = createId();
    const shoe = generateDeck(config.numDecks);
    set(() => ({
      sessionConfig: config,
      sessionId,
      isSessionActive: true,
      sessionStartedAt: new Date(),
      shoe,
      cardsDealt: 0,
      playerHand: null,
      dealerHand: null,
      phase: "idle",
      startingBalance: config.startingBalance,
      bankroll: config.startingBalance,
      currentBet: config.minBet,
      runningCount: 0,
      trueCount: 0,
      rounds: [],
      currentSuggestion: null,
      lastAction: null,
      lastWasCorrectPlay: null,
    }));
  },

  startRound() {
    const state = get();
    if (
      !state.isSessionActive ||
      !state.sessionConfig ||
      state.phase !== "idle"
    ) {
      return;
    }
    if (state.currentBet <= 0 || state.currentBet > state.bankroll) {
      return;
    }

    let shoe = state.shoe;
    let runningCount = state.runningCount;
    let cardsDealt = state.cardsDealt;

    const firstDraw = drawCards(shoe, 2);
    shoe = firstDraw.remaining;
    const secondDraw = drawCards(shoe, 2);
    shoe = secondDraw.remaining;

    const playerCards = firstDraw.drawn;
    const dealerCards = secondDraw.drawn;

    const allDealt = [...playerCards, ...dealerCards];
    runningCount = updateRunningCount(runningCount, allDealt);
    cardsDealt += allDealt.length;

    const playerHand = calculateHand(playerCards);
    const dealerHand = calculateHand(dealerCards);

    const suggestion = getBasicStrategySuggestion(
      playerHand,
      dealerCards[0],
      true,
      false,
    );

    const { sessionConfig } = state;
    const trueCount = sessionConfig
      ? estimateTrueCount(runningCount, cardsDealt, sessionConfig.numDecks)
      : 0;

    set(() => ({
      ...state,
      shoe,
      cardsDealt,
      playerHand,
      dealerHand,
      phase: "playerTurn",
      runningCount,
      trueCount,
      currentSuggestion: suggestion,
      lastAction: null,
      lastWasCorrectPlay: null,
    }));
  },

  hit() {
    const state = get();
    if (state.phase !== "playerTurn" || !state.playerHand) return;

    let { shoe, runningCount, cardsDealt } = state;
    const draw = drawCards(shoe, 1);
    shoe = draw.remaining;
    const newCard = draw.drawn[0];

    const dealt = [newCard];
    runningCount = updateRunningCount(runningCount, dealt);
    cardsDealt += dealt.length;

    const playerHand = calculateHand([...state.playerHand.cards, newCard]);

    const { sessionConfig, dealerHand } = state;
    const trueCount = sessionConfig
      ? estimateTrueCount(runningCount, cardsDealt, sessionConfig.numDecks)
      : 0;

    if (playerHand.isBusted) {
      // Immediate loss, no dealer play needed.
      const bet = state.currentBet;
      const outcome: Outcome = "loss";
      const bankrollAfter = state.bankroll - bet;
      const handIndex = state.rounds.length;

      const wasCorrectPlay =
        state.currentSuggestion != null
          ? state.currentSuggestion === "hit"
          : false;

      const newRound: RoundRecord = {
        roundId: createId(),
        handIndex,
        bet,
        outcome,
        bankrollAfter,
        runningCountAfter: runningCount,
        trueCountAfter: trueCount,
        basicSuggestion: state.currentSuggestion ?? "hit",
        playerAction: "hit",
        wasCorrectPlay,
      };

      set(() => ({
        ...state,
        shoe,
        cardsDealt,
        playerHand,
        dealerHand,
        bankroll: bankrollAfter,
        runningCount,
        trueCount,
        rounds: [...state.rounds, newRound],
        phase: "roundResult",
        lastAction: "hit",
        lastWasCorrectPlay: wasCorrectPlay,
      }));
      return;
    }

    if (!dealerHand) return;

    const suggestion = getBasicStrategySuggestion(
      playerHand,
      dealerHand.cards[0],
      true,
      false,
    );

    set(() => ({
      ...state,
      shoe,
      cardsDealt,
      playerHand,
      runningCount,
      trueCount,
      currentSuggestion: suggestion,
      lastAction: "hit",
      lastWasCorrectPlay: null,
    }));
  },

  stand() {
    const state = get();
    if (state.phase !== "playerTurn" || !state.playerHand || !state.dealerHand)
      return;

    let { shoe, runningCount, cardsDealt } = state;
    let dealerHand = state.dealerHand;

    while (shouldDealerHit(dealerHand)) {
      const draw = drawCards(shoe, 1);
      shoe = draw.remaining;
      const newCard = draw.drawn[0];
      runningCount = updateRunningCount(runningCount, [newCard]);
      cardsDealt += 1;
      dealerHand = calculateHand([...dealerHand.cards, newCard]);
    }

    const { sessionConfig } = state;
    const trueCount = sessionConfig
      ? estimateTrueCount(runningCount, cardsDealt, sessionConfig.numDecks)
      : 0;

    const bet = state.currentBet;
    const { outcome, delta } = resolveOutcome(
      state.playerHand,
      dealerHand,
      bet,
    );
    const bankrollAfter = state.bankroll + delta;
    const handIndex = state.rounds.length;

    const wasCorrectPlay =
      state.currentSuggestion != null
        ? state.currentSuggestion === "stand"
        : false;

    const newRound: RoundRecord = {
      roundId: createId(),
      handIndex,
      bet,
      outcome,
      bankrollAfter,
      runningCountAfter: runningCount,
      trueCountAfter: trueCount,
      basicSuggestion: state.currentSuggestion ?? "stand",
      playerAction: "stand",
      wasCorrectPlay,
    };

    set(() => ({
      ...state,
      shoe,
      cardsDealt,
      dealerHand,
      bankroll: bankrollAfter,
      runningCount,
      trueCount,
      rounds: [...state.rounds, newRound],
      phase: "roundResult",
      lastAction: "stand",
      lastWasCorrectPlay: wasCorrectPlay,
    }));
  },

  double() {
    const state = get();
    if (state.phase !== "playerTurn" || !state.playerHand || !state.dealerHand)
      return;

    if (state.currentBet * 2 > state.bankroll) {
      return;
    }

    let { shoe, runningCount, cardsDealt } = state;
    let dealerHand = state.dealerHand;

    const draw = drawCards(shoe, 1);
    shoe = draw.remaining;
    const newCard = draw.drawn[0];
    runningCount = updateRunningCount(runningCount, [newCard]);
    cardsDealt += 1;

    const playerHand = calculateHand([...state.playerHand.cards, newCard]);

    while (shouldDealerHit(dealerHand)) {
      const dealerDraw = drawCards(shoe, 1);
      shoe = dealerDraw.remaining;
      const dealerCard = dealerDraw.drawn[0];
      runningCount = updateRunningCount(runningCount, [dealerCard]);
      cardsDealt += 1;
      dealerHand = calculateHand([...dealerHand.cards, dealerCard]);
    }

    const { sessionConfig } = state;
    const trueCount = sessionConfig
      ? estimateTrueCount(runningCount, cardsDealt, sessionConfig.numDecks)
      : 0;

    const bet = state.currentBet * 2;
    const { outcome, delta } = resolveOutcome(playerHand, dealerHand, bet);
    const bankrollAfter = state.bankroll + delta;
    const handIndex = state.rounds.length;

    const wasCorrectPlay =
      state.currentSuggestion != null
        ? state.currentSuggestion === "double"
        : false;

    const newRound: RoundRecord = {
      roundId: createId(),
      handIndex,
      bet,
      outcome,
      bankrollAfter,
      runningCountAfter: runningCount,
      trueCountAfter: trueCount,
      basicSuggestion: state.currentSuggestion ?? "double",
      playerAction: "double",
      wasCorrectPlay,
    };

    set(() => ({
      ...state,
      shoe,
      cardsDealt,
      playerHand,
      dealerHand,
      bankroll: bankrollAfter,
      runningCount,
      trueCount,
      rounds: [...state.rounds, newRound],
      phase: "roundResult",
      lastAction: "double",
      lastWasCorrectPlay: wasCorrectPlay,
    }));
  },

  endRound() {
    const state = get();
    if (state.phase !== "roundResult") return;

    set(() => ({
      ...state,
      playerHand: null,
      dealerHand: null,
      phase: "idle",
      currentSuggestion: null,
      lastAction: null,
      lastWasCorrectPlay: null,
    }));
  },

  endSession() {
    const state = get();
    if (!state.isSessionActive || !state.sessionConfig || !state.sessionId) {
      return;
    }

    const now = new Date();
    const summary = buildSessionSummary(
      state.sessionId,
      state.sessionStartedAt ?? now,
      now,
      state.sessionConfig.startingBalance,
      state.sessionConfig.numDecks,
      state.rounds,
    );

    // For now we just compute the summary; persistence will be added later.
    console.log("Session summary", summary);

    set(() => ({
      ...state,
      isSessionActive: false,
      phase: "idle",
    }));
  },
}));

