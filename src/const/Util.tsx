import {type CharacterModel, ObjectiveType, type PlayerModel} from "../model/PlayerModel.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {assertExists} from "./GameUtils.tsx";
import type {Active} from "@dnd-kit/core";

export const range = (start: number, end: number): number[] =>
  Array.from({length: end - start + 1}, (_, i) => start + i);

export const gameStartState: GameModel = {
  gameId: "",
  players: [],
  locations: [
    {
      name: "Deep Desert",
      id: 1,
      agents: []
    }
  ],
}

export const characterStartState: CharacterModel = {
  name: "",
  urls: [],
  avatarUrl: ""
}

export const playerStartState: PlayerModel = {
  name: "",
  character: characterStartState,
  color: "",
  isThisPlayer: false,
  firstPlayer: false,
  victoryPoints: 0,
  objectives: [
    ObjectiveType.DesertMouse,
    ObjectiveType.Any,
  ],
  numCards: {
    inHand: 0,
    inPlay: 0,
    inDiscardPile: 0,
    inDrawPile: 0,
    intrigues: 0
  },
  resources: {
    water: 0,
    spice: 0,
    solari: 0
  },
  agents: [
    {id: `${characterStartState.name}#1`},
    {id: `${characterStartState.name}#2`},
    {id: `${characterStartState.name}#3`}
  ],
  swordmasterUnlocked: false,
  combat: {
    troopsInGarrison: 3,
    troopsInCombat: 0,
    wormsInCombat: 0,
    strength: 0
  }
}

export const PRINCESS_IRULAN: CharacterModel = {
  name: "Princess Irulan",
  urls: ["http://localhost:8080/characters/princess_irulan.jpg"],
  avatarUrl: "http://localhost:8080/avatars/princess_irulan.jpg"
}
export const PLAYER_1: PlayerModel = {
  ...playerStartState,
  name: "P1",
  character: PRINCESS_IRULAN,
  isThisPlayer: true,
  color: "RED",
  agents: [
    {id: `${PRINCESS_IRULAN.name}#1`},
    {id: `${PRINCESS_IRULAN.name}#2`},
    {id: `${PRINCESS_IRULAN.name}#3`},
  ]
}

export const MUAD_DIB: CharacterModel = {
  name: "Muad-Dib",
  urls: ["http://localhost:8080/characters/muaddib.jpg"],
  avatarUrl: "http://localhost:8080/avatars/muaddib.jpg"
}
export const PLAYER_2: PlayerModel = {
  ...playerStartState,
  name: "P2",
  isThisPlayer: false,
  character: MUAD_DIB,
  color: "BLUE",
  agents: [
    {id: `${MUAD_DIB.name}#1`},
    {id: `${MUAD_DIB.name}#2`},
    {id: `${MUAD_DIB.name}#3`},
  ]
}

export const GURNEY_HALLECK: CharacterModel = {
  name: "Gurney Halleck",
  urls: ["http://localhost:8080/characters/gurney_halleck.jpg"],
  avatarUrl: "http://localhost:8080/avatars/gurney_halleck.jpg"
}
export const PLAYER_3: PlayerModel = {
  ...playerStartState,
  name: "P3",
  isThisPlayer: false,
  character: GURNEY_HALLECK,
  color: "GOLD",
  agents: [
    {id: `${GURNEY_HALLECK.name}#1`},
    {id: `${GURNEY_HALLECK.name}#2`},
    {id: `${GURNEY_HALLECK.name}#3`},
  ]
}

export const EMPEROR_SHADDAM: CharacterModel = {
  name: "Emperor Shaddam",
  urls: ["http://localhost:8080/characters/shaddam_corrino.jpg"],
  avatarUrl: "http://localhost:8080/avatars/shaddam_corrino.jpg"
}
export const PLAYER_4: PlayerModel = {
  ...playerStartState,
  name: "P4",
  isThisPlayer: false,
  character: EMPEROR_SHADDAM,
  color: "GREEN",
  agents: [
    {id: `${EMPEROR_SHADDAM.name}#1`},
    {id: `${EMPEROR_SHADDAM.name}#2`},
    {id: `${EMPEROR_SHADDAM.name}#3`},
  ]
}

export function createId(items: (string | number)[]): string {
  return items
    .map(item =>
      String(item)
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase()
    )
    .join('#');
}

export function findDraggableColor(gameModel: GameModel, activeDraggable: Active) {
  return assertExists(
    gameModel.players.find(p => p.agents.some(a => a.id === activeDraggable.id)),
    "Unknown Draggable ID"
  ).color
}