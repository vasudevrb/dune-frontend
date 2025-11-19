import type {GameModel} from "../model/GameModel.tsx";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {FactionType, type PlayerModel} from "../model/PlayerModel.tsx";

export function getAgent(game: GameModel, agentId: string) {
 return game.players
   .flatMap(player => player.agents)
   .find(agent => agent.id === agentId)
}

export function assertExists<T>(value: T | undefined, message: string): T {
  if (value == null) throw new Error(message);
  return value;
}

export function placeAgent(game: GameModel, agentId: UniqueIdentifier, locationId: number) {
  const player = assertExists(
    game.players.find(p => p.agents.some(agent => agent.id === agentId)),
    `Player with agentId: ${agentId} not found.`
  )

  const agent = assertExists(
    player.agents.find(agent => agent.id === agentId),
    `Agent with id ${agentId} not found.`
  )

  const location = assertExists(
    game.locations.find(location => location.id === locationId),
   `Location with id ${locationId} not found.`
  )

  player.agents = player.agents.filter(agent => agent.id != agentId)
  location.agents.push({
    agentId: agent.id,
    color: player.color,
    playerName: player.name
  });
  agent.atLocation = locationId;
}

export function moveThisPlayerToLast(players: PlayerModel[]) {
  const thisPlayerIndex = players.findIndex(player => player.isThisPlayer);
  return [...players.slice(thisPlayerIndex + 1), ...players.slice(0, thisPlayerIndex + 1)];
}

export function recallAgent(game: GameModel, agentId: UniqueIdentifier, locationId: number) {
  const location = assertExists(
    game.locations.find(location => location.id === locationId),
    `Location with id ${locationId} not found.`
  )

  const locAgent = assertExists(
    location.agents.find(agent => agent.agentId === agentId),
    `Agent with id ${agentId} at ${locationId} not found.`
  )

  const player = assertExists(
    game.players.find(p => p.name === locAgent.playerName),
    `Player with agentId: ${agentId} not found.`
  )

  player.agents.push({id: agentId.toString()})
  location.agents = location.agents.filter(agent => agent.agentId != agentId)
}

export function placeSpy(game: GameModel, spyId: UniqueIdentifier, spyLocationId: number) {
  const player = assertExists(
    game.players.find(p => p.spies.some(spy => spy.id === spyId)),
    `Player with spyId: ${spyId} not found.`
  )

  const spy = assertExists(
    player.spies.find(spy => spy.id === spyId),
    `Spy with id ${spyId} not found.`
  )

  const spyLocation = assertExists(
    game.spyLocations.find(sl => sl.id === spyLocationId),
    `Spy Location with id ${spyLocationId} not found.`
  )

  player.spies = player.spies.filter(spy => spy.id != spyId)
  spyLocation.spies.push({
    spyId: spy.id,
    color: player.color,
    playerName: player.name
  });
  spy.atLocation = spyLocationId;
}

export function recallSpy(game: GameModel, spyId: UniqueIdentifier, spyLocationId: number) {
  const spyLocation = assertExists(
    game.spyLocations.find(sl => sl.id === spyLocationId),
    `Spy Location with id ${spyLocationId} not found.`
  )

  const spy = assertExists(
    spyLocation.spies.find(spy => spy.spyId === spyId),
    `Spy with id ${spyId} at ${spyLocationId} not found.`
  )

  const player = assertExists(
    game.players.find(p => p.name === spy.playerName),
    `Player with spyId: ${spyId} not found.`
  )

  player.spies.push({id: spyId.toString()})
  spyLocation.spies = spyLocation.spies.filter(spy => spy.spyId != spyId)
}

export function setFactionInfluence(game:GameModel, playerName: string, factionType: FactionType, influence: number) {
  const player = assertExists(
    game.players.find(p => p.name === playerName),
    `Player with name: ${playerName} not found.`
  )

  switch (factionType) {
    case FactionType.Fremen:
      player.factionInfluences.Fremen = influence;
      break;
    case FactionType.BeneGesserit:
      player.factionInfluences.BeneGesserit = influence;
      break;
    case FactionType.SpacingGuild:
      player.factionInfluences.SpacingGuild = influence;
      break;
    case FactionType.Emperor:
      player.factionInfluences.Emperor = influence;
      break;
  }
}