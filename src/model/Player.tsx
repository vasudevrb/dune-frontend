export class PlayerModel {
  name: string;
  character: CharacterModel;
  color: string;
  isThisPlayer: boolean;

  victoryPoints: number = 0;
  numCards: NumCardsModel = new NumCardsModel();
  resources: Map<string, number> = new Map()
  numAgentsAvailable: number = 2;
  numAgentsUsed: number = 0;
  swordmasterUnlocked: boolean = false;
  firstPlayer: boolean = false;

  constructor(name: string, character: CharacterModel, color: string, isThisPlayer: boolean) {
    this.name = name;
    this.character = character;
    this.color = color;
    this.isThisPlayer = isThisPlayer;
  }
}

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

export class NumCardsModel {
  inHand: number = 0;
  inPlay: number = 0;
  inDiscardPile: number = 0;
  inDrawPile: number = 0;
}