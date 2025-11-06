import type {PlayerModel} from "./PlayerModel.tsx";
import type {AgentLocationModel} from "./AgentLocationModel.tsx";

export interface GameModel {
  gameId: string;
  players: PlayerModel[];
  locations: AgentLocationModel[];
  currentPlayer: string;
  firstPlayer: string;
}