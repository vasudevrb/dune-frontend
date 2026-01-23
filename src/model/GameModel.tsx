import type {CardModel, PlayerModel} from "./PlayerModel.tsx";
import type {AgentLocationModel} from "./AgentLocationModel.tsx";
import type {SpyLocationModel} from "./SpyLocationModel.tsx";
import type {SardaukarCommanderModel} from "./SardaukarCommanderModel.tsx";

export interface GameModel {
  gameId: string;
  players: PlayerModel[];
  locations: AgentLocationModel[];
  spyLocations: SpyLocationModel[];
  imperiumRow: CardModel[];
  reserveRow: CardModel[];
  bonusSpice: {
    deepDesert: number;
    haggaBasin: number;
    imperialBasin: number;
  };
  highCouncil: string[];
  currentContracts: string[];
  currentConflict: string;
  nextConflictLevel: number;
  currentPlayer: string;
  firstPlayer: string;
  shieldWallBroken: boolean;
  containsRivals: boolean;

  currentTechs: CardModel[];
  currentSkills: CardModel[];
  sardaukarCommanders: SardaukarCommanderModel[];
}