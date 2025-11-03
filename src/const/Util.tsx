import {CharacterModel} from "../model/PlayerModel.tsx";

export const PRINCESS_IRULAN = new CharacterModel
(
  "Princess Irulan",
  ["http://localhost:8080/characters/princess_irulan.jpg"],
  "http://localhost:8080/avatars/princess_irulan.jpg"
)

export const MUAD_DIB = new CharacterModel
(
  "Muad-Dib",
  ["http://localhost:8080/characters/muaddib.jpg"],
  "http://localhost:8080/avatars/muaddib.jpg"
)

export const GURNEY_HALLECK = new CharacterModel
(
  "Gurney Halleck",
  ["http://localhost:8080/characters/gurney_halleck.jpg"],
  "http://localhost:8080/avatars/gurney_halleck.jpg"
)

export const EMPEROR_SHADDAM = new CharacterModel
(
  "Emperor Shaddam",
  ["http://localhost:8080/characters/shaddam_corrino.jpg"],
  "http://localhost:8080/avatars/shaddam_corrino.jpg"
)

export const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
