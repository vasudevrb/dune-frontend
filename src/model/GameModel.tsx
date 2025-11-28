import type {CardModel, PlayerModel} from "./PlayerModel.tsx";
import type {AgentLocationModel} from "./AgentLocationModel.tsx";
import type {SpyLocationModel} from "./SpyLocationModel.tsx";

export interface GameModel {
  gameId: string;
  players: PlayerModel[];
  locations: AgentLocationModel[];
  spyLocations: SpyLocationModel[];
  imperiumRow: CardModel[];
  reserveRow: CardModel[];
  currentConflict: string;
  nextConflictLevel: number;
  currentPlayer: string;
  firstPlayer: string;
}