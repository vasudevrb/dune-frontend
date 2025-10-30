export class PlayerModel {
  name: string;
  character: CharacterModel;
  color: string;
  isThisPlayer: boolean;
  victoryPoints: number = 0;
  numCards: NumCardsModel = new NumCardsModel();
  resources: Map<ResourceType, number> = new Map([
    [ResourceType.Water, 0],
    [ResourceType.Spice, 0],
    [ResourceType.Solari, 0]
  ])
  numAgentsAvailable: number = 3;
  numAgentsUsed: number = 1;
  swordmasterUnlocked: boolean = false;
  firstPlayer: boolean = false;
  combat: CombatModel = new CombatModel();

  constructor(name: string, character: CharacterModel, color: string, isThisPlayer: boolean) {
    this.name = name;
    this.character = character;
    this.color = color;
    this.isThisPlayer = isThisPlayer;
  }
}

export const ResourceType = {
  Water: "Water",
  Spice: "Spice",
  Solari: "Solari",
} as const;

export type ResourceType = keyof typeof ResourceType;

export class CharacterModel {
  name: string;
  urls: string[];
  avatarUrl: string;

  constructor(name: string, urls: string[], avatarUrl: string) {
    this.name = name;
    this.urls = urls;
    this.avatarUrl = avatarUrl;
  }
}

export class CombatModel {
  troopsInGarrison: number = 3;
  troopsInCombat: number = 0;
  wormsInCombat: number = 0;
  strength: number = 0
}

export class NumCardsModel {
  inHand: number = 0;
  inPlay: number = 0;
  inDiscardPile: number = 0;
  inDrawPile: number = 0;
}