import type {CardModel, PlayerModel} from "./PlayerModel.tsx";
import type {AgentLocationModel} from "./AgentLocationModel.tsx";

export interface GameModel {
  gameId: string;
  players: PlayerModel[];
  locations: AgentLocationModel[];
  imperiumRow: CardModel[];
  reserveRow: CardModel[];
  currentPlayer: string;
  firstPlayer: string;
}