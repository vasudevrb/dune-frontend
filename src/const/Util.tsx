import {type CharacterModel, FactionType, ObjectiveType, type PlayerModel} from "../model/PlayerModel.tsx";
import type {GameModel} from "../model/GameModel.tsx";
import {notifications} from "@mantine/notifications";
import type {AgentCardPreview} from "../model/AgentCardPreview.tsx";
import {locations} from "../model/AgentLocationModel.tsx";
import {spyLocations} from "../model/SpyLocationModel.tsx";
import type {RevealCardsPreview} from "../model/RevealCardsPreview.tsx";

export const range = (start: number, end: number): number[] =>
  Array.from({length: end - start + 1}, (_, i) => start + i);

export const cardPreviewStartState: AgentCardPreview = {
  url: undefined,
  playerName: "",
  message: "",
  show: false
}

export const revealPreviewStartState: RevealCardsPreview = {
  urls: [
    "http://localhost:8080/imperium_cards/imperium_26.jpg",
    "http://localhost:8080/imperium_cards/imperium_27.jpg",
    "http://localhost:8080/imperium_cards/imperium_28.jpg",
    "http://localhost:8080/imperium_cards/imperium_28.jpg",
    "http://localhost:8080/imperium_cards/imperium_28.jpg",
    "http://localhost:8080/imperium_cards/imperium_28.jpg",
    "http://localhost:8080/imperium_cards/imperium_28.jpg",
    "http://localhost:8080/imperium_cards/imperium_30.jpg",
  ],
  playerName: "player 3",
  show: false
}

export const gameStartState: GameModel = {
  gameId: "",
  players: [],
  firstPlayer: "P1",
  currentPlayer: "P2",
  locations: locations,
  spyLocations: spyLocations,
  currentConflict: "http://localhost:8080/conflict_cards/level_2/conf_2_5.jpg",
  nextConflictLevel: 1,
  bonusSpice: {
    deepDesert: 0,
    haggaBasin: 0,
    imperialBasin: 0
  },
  currentContracts: [
    "http://localhost:8080/contracts/contract_15.png",
    "http://localhost:8080/contracts/contract_17.png"
  ],
  imperiumRow: [],
  reserveRow: []
}

export const characterStartState: CharacterModel = {
  name: "",
  urls: [],
  avatarUrl: "",
  additionalInfo: {}
}

export const playerStartState: PlayerModel = {
  name: "",
  character: characterStartState,
  color: "",
  isThisPlayer: false,
  victoryPoints: 0,
  objectives: [
    ObjectiveType.DesertMouse,
  ],
  factionAlliances: [
    FactionType.Fremen,
    FactionType.SpacingGuild
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
    {id: `agent-#1`},
    {id: `agent-#2`},
    {id: `agent-#3`}
  ],
  spies: [
    {id: `spy-#1`},
    {id: `spy-#2`},
    {id: `spy-#3`}
  ],
  controlFlags: [
    {id: `control_flag-#1`},
    {id: `control_flag-#2`},
    {id: `control_flag-#3`}
  ],
  factionInfluences: {
    Fremen: 0,
    BeneGesserit: 0,
    SpacingGuild: 0,
    Emperor: 0
  },
  contracts: [],
  swordmasterUnlocked: false,
  makerHookUnlocked: false,
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
  avatarUrl: "http://localhost:8080/avatars/princess_irulan.jpg",
  additionalInfo: {}
}
export const PLAYER_1: PlayerModel = {
  ...playerStartState,
  name: "P1",
  character: PRINCESS_IRULAN,
  isThisPlayer: false,
  color: "RED",
  agents: [
    {id: `agent-${PRINCESS_IRULAN.name}#1`},
    {id: `agent-${PRINCESS_IRULAN.name}#2`},
    {id: `agent-${PRINCESS_IRULAN.name}#3`},
  ],
  spies: [
    {id: `spy-${PRINCESS_IRULAN.name}#1`},
    {id: `spy-${PRINCESS_IRULAN.name}#2`},
    {id: `spy-${PRINCESS_IRULAN.name}#3`},
  ],
  controlFlags: [
    {id: `control_flag-${PRINCESS_IRULAN.name}#1`},
    {id: `control_flag-${PRINCESS_IRULAN.name}#2`},
    {id: `control_flag-${PRINCESS_IRULAN.name}#3`},
  ],
  factionInfluences: {
    Fremen: 2,
    BeneGesserit: 1,
    SpacingGuild: 3,
    Emperor: 2
  },
  combat: {
    troopsInCombat: 2,
    troopsInGarrison: 4,
    wormsInCombat: 1,
    strength: 9
  },
  makerHookUnlocked: true,
}

export const MUAD_DIB: CharacterModel = {
  name: "Muad-Dib",
  urls: ["http://localhost:8080/characters/muaddib.jpg"],
  avatarUrl: "http://localhost:8080/avatars/muaddib.jpg",
  additionalInfo: {}
}
export const PLAYER_2: PlayerModel = {
  ...playerStartState,
  name: "P2",
  isThisPlayer: false,
  character: MUAD_DIB,
  color: "BLUE",
  agents: [
    {id: `agent-${MUAD_DIB.name}#1`},
    {id: `agent-${MUAD_DIB.name}#2`},
    {id: `agent-${MUAD_DIB.name}#3`},
  ],
  spies: [
    {id: `spy-${MUAD_DIB.name}#1`},
    {id: `spy-${MUAD_DIB.name}#2`},
    {id: `spy-${MUAD_DIB.name}#3`},
  ],
  controlFlags: [
    {id: `control_flag-${MUAD_DIB.name}#1`},
    {id: `control_flag-${MUAD_DIB.name}#2`},
    {id: `control_flag-${MUAD_DIB.name}#3`},
  ],
  combat: {
    troopsInCombat: 4,
    troopsInGarrison: 2,
    wormsInCombat: 2,
    strength: 17
  },
}

export const GURNEY_HALLECK: CharacterModel = {
  name: "Gurney Halleck",
  urls: ["http://localhost:8080/characters/gurney_halleck.jpg"],
  avatarUrl: "http://localhost:8080/avatars/gurney_halleck.jpg",
  additionalInfo: {}
}
export const PLAYER_3: PlayerModel = {
  ...playerStartState,
  name: "P3",
  isThisPlayer: false,
  character: GURNEY_HALLECK,
  color: "GOLD",
  agents: [
    {id: `agent-${GURNEY_HALLECK.name}#1`},
    {id: `agent-${GURNEY_HALLECK.name}#2`},
    {id: `agent-${GURNEY_HALLECK.name}#3`},
  ],
  spies: [
    {id: `spy-${GURNEY_HALLECK.name}#1`},
    {id: `spy-${GURNEY_HALLECK.name}#2`},
    {id: `spy-${GURNEY_HALLECK.name}#3`},
  ],
  controlFlags: [
    {id: `control_flag-${GURNEY_HALLECK.name}#1`},
    {id: `control_flag-${GURNEY_HALLECK.name}#2`},
    {id: `control_flag-${GURNEY_HALLECK.name}#3`},
  ],
  makerHookUnlocked: true,
  combat: {
    troopsInCombat: 8,
    troopsInGarrison: 4,
    wormsInCombat: 3,
    strength: 23
  },
}

export const FEYD_RAUTHA: CharacterModel = {
  name: "Feyd Rautha",
  urls: ["http://localhost:8080/characters/feyd_rautha.jpg"],
  avatarUrl: "http://localhost:8080/avatars/feyd_rautha.jpg",
  additionalInfo: {
    signetStatus: 0
  }
}
export const PLAYER_4: PlayerModel = {
  ...playerStartState,
  name: "P4",
  isThisPlayer: true,
  character: FEYD_RAUTHA,
  color: "GREEN",
  agents: [
    {id: `agent-${FEYD_RAUTHA.name}#1`},
    {id: `agent-${FEYD_RAUTHA.name}#2`},
    {id: `agent-${FEYD_RAUTHA.name}#3`},
  ],
  spies: [
    {id: `spy-${FEYD_RAUTHA.name}#1`},
    {id: `spy-${FEYD_RAUTHA.name}#2`},
    {id: `spy-${FEYD_RAUTHA.name}#3`},
  ],
  controlFlags: [
    {id: `control_flag-${FEYD_RAUTHA.name}#1`},
    {id: `control_flag-${FEYD_RAUTHA.name}#2`},
    {id: `control_flag-${FEYD_RAUTHA.name}#3`},
  ],
  private: {
    inHandCards: [
      {url: "http://localhost:8080/imperium_cards_starter/starter_6.jpg"},
      {url: "http://localhost:8080/imperium_cards_starter/starter_2.jpg"},
      {url: "http://localhost:8080/imperium_cards_starter/starter_3.jpg"},
      {url: "http://localhost:8080/imperium_cards_starter/starter_1.jpg"},
      {url: "http://localhost:8080/imperium_cards_starter/starter_1.jpg"}
    ],
    inPlayCards: [
      {url: "http://localhost:8080/imperium_cards_starter/starter_5.jpg"},
    ],
    discardedCards: [
      {url: "http://localhost:8080/imperium_cards/imperium_26.jpg"},
      {url: "http://localhost:8080/imperium_cards/imperium_27.jpg"},
    ],
    intrigueCards: [
      {url: "http://localhost:8080/imperium_cards/imperium_26.jpg"},
      {url: "http://localhost:8080/imperium_cards/imperium_27.jpg"},
    ]
  },
  contracts: [
    { url: "http://localhost:8080/contracts/contract_17.png", completed: false},
    { url: "http://localhost:8080/contracts/contract_18.png", completed: true},
    { url: "http://localhost:8080/contracts/contract_19.png", completed: true}
  ],
  combat: {
    troopsInCombat: 1,
    troopsInGarrison: 15,
    wormsInCombat: 0,
    strength: 4
  },
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

export function showNotification(message: string) {
  notifications.show({
    message: message,
    withCloseButton: false,
    autoClose: 3000,
    radius: 0,
    icon: <></>,
    className: "notification-bg",
    styles: {
      root: {
        height: 90,
        transition: 'ease-in-out'
      },
      description: {
        fontWeight: 500,
        fontSize: 18,
        fontFamily:  "IBM Plex Sans",
        color: '#cacaca',
      },
    },
  })
}