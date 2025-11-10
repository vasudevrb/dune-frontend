import {create} from "zustand/react";

export interface GameState {
  gameId: string;
  setGameId: (id: string) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  imperiumRowOpened: boolean;
  setImperiumRowOpened: (opened: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: "",
  setGameId: (gameId: string) => set({gameId: gameId}),
  playerName: "",
  setPlayerName: (name: string) => set({ playerName: name }),
  imperiumRowOpened: false,
  setImperiumRowOpened: (opened: boolean) => set({ imperiumRowOpened: opened }),
}));