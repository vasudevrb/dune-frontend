export class PlayerModel {
  name: string;
  character: CharacterModel;
  color: string;
  isThisPlayer: boolean;
  victoryPoints: number = 0;
  objectives: ObjectiveType[] = [
    ObjectiveType.DesertMouse,
    ObjectiveType.Any,
  ];
  numCards: NumCardsModel = new NumCardsModel();
  resources: Map<ResourceType, number> = new Map([
    [ResourceType.Water, 0],
    [ResourceType.Spice, 0],
    [ResourceType.Solari, 0]
  ])
  agents: AgentModel[];
  swordmasterUnlocked: boolean = false;
  firstPlayer: boolean = false;
  combat: CombatModel = new CombatModel();

  constructor(name: string, character: CharacterModel, color: string, isThisPlayer: boolean) {
    this.name = name;
    this.character = character;
    this.color = color;
    this.isThisPlayer = isThisPlayer;
    this.agents = [
      new AgentModel(`${this.character.name}#1`),
      new AgentModel(`${this.character.name}#2`),
      new AgentModel(`${this.character.name}#3`)
    ]
  }
}

export const ResourceType = {
  Water: "Water",
  Spice: "Spice",
  Solari: "Solari",
} as const;

export type ResourceType = keyof typeof ResourceType;

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
  strength: number = 2
}

export class NumCardsModel {
  inHand: number = 0;
  inPlay: number = 0;
  inDiscardPile: number = 0;
  inDrawPile: number = 0;
  intrigues: number = 0;
}

export class AgentModel {
  id: string;
  atLocation: number | undefined;

  constructor(id: string) {
    this.id = id;
  }
}