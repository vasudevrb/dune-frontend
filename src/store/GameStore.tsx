import {create} from "zustand/react";
import type {GameModel} from "../model/GameModel.tsx";
import {gameStartState} from "../const/Util.tsx";

export interface GameState {
  gameState: GameModel;
  setGameState: (state: GameModel) => void;
  gameId: string;
  setGameId: (id: string) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  imperiumRowOpened: boolean;
  setImperiumRowOpened: (opened: boolean) => void;
  initialTurnOrder: number;
  setInitialTurnOrder: (newTurnOrder: number) => void;
  includesRivals: boolean;
  setIncludesRivals: (rivals: boolean) => void;
  includesBloodlines: boolean;
  setIncludesBloodlines: (bloodlines: boolean) => void;
  includesAtomics: boolean;
  setIncludesAtomics: (atomics: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: gameStartState,
  setGameState: (state: GameModel) => set({gameState: state}),
  gameId: "",
  setGameId: (gameId: string) => set({gameId: gameId}),
  playerName: "",
  setPlayerName: (name: string) => set({ playerName: name }),
  imperiumRowOpened: false,
  setImperiumRowOpened: (opened: boolean) => set({ imperiumRowOpened: opened }),
  initialTurnOrder: 0,
  setInitialTurnOrder: (newTurnOrder: number) => set({initialTurnOrder: newTurnOrder}),
  includesRivals: false,
  setIncludesRivals: (rivals: boolean) => set({includesRivals: rivals}),
  includesBloodlines: false,
  setIncludesBloodlines: (bloodlines: boolean) => set({includesBloodlines: bloodlines}),
  includesAtomics: false,
  setIncludesAtomics: (atomics: boolean) => set({includesAtomics: atomics}),
}));