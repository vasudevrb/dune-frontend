import type {PlayerModel} from "./PlayerModel.tsx";
import {AgentLocationModel} from "./AgentLocationModel.tsx";

export interface GameModel {
  gameId: string;
  players: PlayerModel[];
  locations: AgentLocationModel[]
}