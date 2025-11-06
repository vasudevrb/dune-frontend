export interface PlayerModel {
  name: string;
  character: CharacterModel;
  color: string;
  isThisPlayer: boolean;
  victoryPoints: number;
  objectives: ObjectiveType[];
  numCards: NumCardsModel;
  resources: ResourcesModel;
  factionInfluences: FactionInfluencesModel;
  agents: AgentModel[];
  spies: SpyModel[];
  controlFlags: ControlFlagModel[];
  swordmasterUnlocked: boolean;
  makerHookUnlocked: boolean;
  combat: CombatModel;
}

interface ResourcesModel {
  water: number,
  spice: number,
  solari: number
}

interface FactionInfluencesModel {
  Fremen: number,
  BeneGesserit: number,
  SpacingGuild: number,
  Emperor: number
}

export const CombatModifierType = {
  Troop: "Troop",
  Worm: "Worm",
  Strength: "Strength",
} as const;

export type CombatModifierType = keyof typeof CombatModifierType;

export const ObjectiveType = {
  DesertMouse: "DesertMouse",
  Crysknife: "Crysknife",
  Ornithopter: "Ornithopter",
  Any: "Any",
} as const;

export type ObjectiveType = keyof typeof ObjectiveType;

export const FactionType = {
  Fremen: "Fremen",
  BeneGesserit: "BeneGesserit",
  SpacingGuild: "SpacingGuild",
  Emperor: "Emperor",
} as const;

export type FactionType = keyof typeof FactionType;

export interface CharacterModel {
  name: string;
  urls: string[];
  avatarUrl: string;
}

export interface CombatModel {
  troopsInGarrison: number;
  troopsInCombat: number;
  wormsInCombat: number;
  strength: number;
}

export interface NumCardsModel {
  inHand: number;
  inPlay: number;
  inDiscardPile: number;
  inDrawPile: number;
  intrigues: number;
}

export interface AgentModel {
  id: string;
  atLocation?: number;
}

export interface SpyModel {
  id: string;
  atLocation?: number;
}
export interface ControlFlagModel {
  id: string;
  atLocation?: number;
}