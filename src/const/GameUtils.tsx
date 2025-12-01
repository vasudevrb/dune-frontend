import type {GameModel} from "../model/GameModel.tsx";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {CombatUnitType, FactionType, type ObjectiveType, type PlayerModel} from "../model/PlayerModel.tsx";
import {showNotification} from "./Util.tsx";

export const TroopMovementLocation = {
  Combat: "Combat", Garrison: "Garrison", Supply: "Supply",
} as const;
export type TroopMovementLocation = keyof typeof TroopMovementLocation;

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

export function placeControlFlag(game: GameModel, controlFlagId: UniqueIdentifier, locationId: number) {
  const player = assertExists(
    game.players.find(p => p.controlFlags.some(cf => cf.id === controlFlagId)),
    `Player with control flag: ${controlFlagId} not found.`
  )

  const location = assertExists(
    game.locations.find(location => location.id === locationId),
    `Location with id ${locationId} not found.`
  )

  player.controlFlags = player.controlFlags.filter(cf => cf.id != controlFlagId)
  location.controlFlag = {
    controlFlagId: controlFlagId as string,
    playerName: player.name,
    color: player.color
  }
}

export function recallControlFlag(game: GameModel, controlFlagId: UniqueIdentifier) {
  const location = assertExists(
    game.locations.find(location => location.controlFlag?.controlFlagId === controlFlagId),
    `Location containing control flag with id ${controlFlagId} not found.`
  )

  const player = assertExists(
    game.players.find(p => p.name === location.controlFlag?.playerName),
    `Player with controlFlagId: ${controlFlagId} not found.`
  )

  player.controlFlags.push({id: controlFlagId.toString()})
  location.controlFlag = undefined
}

export function moveThisPlayerToLast(players: PlayerModel[]) {
  const thisPlayerIndex = players.findIndex(player => player.isThisPlayer);
  return [...players.slice(thisPlayerIndex + 1), ...players.slice(0, thisPlayerIndex + 1)];
}

export function recallAgent(game: GameModel, agentId: UniqueIdentifier) {
  const location = assertExists(
    game.locations.find(location => location.agents.find(a => a.agentId === agentId)),
    `Location containing agent with id ${agentId} not found.`
  )

  const locAgent = assertExists(
    location.agents.find(agent => agent.agentId === agentId),
    `Agent with id ${agentId} not found.`
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

export function recallSpy(game: GameModel, spyId: UniqueIdentifier) {
  const spyLocation = assertExists(
    game.spyLocations.find(sl => sl.spies.find(spy => spy.spyId === spyId)),
    `Spy Location containing a spy with id ${spyId} not found.`
  )

  const spy = assertExists(
    spyLocation.spies.find(spy => spy.spyId === spyId),
    `Spy with id ${spyId} not found.`
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

export function setFeydSignetStatus(game: GameModel, newSignetStatus: number) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )
  thisPlayer.character.additionalInfo.signetStatus = newSignetStatus;
}

export function moveUnit(game: GameModel, destination: TroopMovementLocation) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )

  switch (destination) {
    case TroopMovementLocation.Combat:
      return moveTroopToCombat(thisPlayer);
    case TroopMovementLocation.Garrison:
      return moveTroopToGarrison(thisPlayer);
    case  TroopMovementLocation.Supply:
      return moveTroopToSupply(thisPlayer);
  }
}

function moveTroopToCombat(player: PlayerModel) {
  if (player.combat.troopsInGarrison < 1) {
    showNotification("No troops available in garrison");
    return false;
  }

  player.combat.troopsInCombat++;
  player.combat.strength+=2;
  player.combat.troopsInGarrison--;
  return true;
}

function moveTroopToGarrison(player: PlayerModel) {
  if (player.combat.troopsInCombat < 1) {
    showNotification("No troops participating in the conflict");
    return false;
  }

  player.combat.troopsInCombat--;
  player.combat.strength-=2;
  player.combat.troopsInGarrison++;
  return true;
}

export function addOrRemoveCombatUnit(game: GameModel, unit: CombatUnitType, add: boolean) {
  const player = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )

  switch (unit) {
    case CombatUnitType.Troop:
      if (add) {
        player.combat.troopsInGarrison++;
        return true;
      } else if (player.combat.troopsInGarrison > 0) {
        player.combat.troopsInGarrison--;
        return true;
      }
      return false;
    case CombatUnitType.Sandworm:
      if (add) {
        player.combat.wormsInCombat++;
        player.combat.strength+=3;
        return true
      } else if (player.combat.wormsInCombat > 0) {
        player.combat.wormsInCombat--;
        player.combat.strength-=3;
        return true
      }
      return false;
    case CombatUnitType.Strength:
      if (add) {
        player.combat.strength++;
        return true
      } else if (player.combat.strength > 0) {
        player.combat.strength--;
        return true
      }
      return false;
  }
}

export function addOrRemoveBonusSpice(game: GameModel, locationId: number, add: boolean) {
  switch (locationId) {
    case 9:
      if (add) {
        game.bonusSpice.deepDesert++;
        return true;
      } else if (game.bonusSpice.deepDesert > 0) {
        game.bonusSpice.deepDesert--;
        return true;
      }
      return false;
    case 10:
      if (add) {
        game.bonusSpice.haggaBasin++;
        return true;
      } else if (game.bonusSpice.haggaBasin > 0) {
        game.bonusSpice.haggaBasin--;
        return true;
      }
      return false;
    case 11:
      if (add) {
        game.bonusSpice.imperialBasin++;
        return true;
      } else if (game.bonusSpice.imperialBasin > 0) {
        game.bonusSpice.imperialBasin--;
        return true;
      }
      return false;
  }
  return false;
}

export function addOrRemoveResource(game: GameModel, resourceType: string, add: boolean) {
  const player = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )

  switch (resourceType) {
    case "water":
      if (add) {
        player.resources.water++;
        return true
      } else if (player.resources.water > 0) {
        player.resources.water--;
        return true
      }
      return false;
    case "spice":
      if (add) {
        player.resources.spice++;
        return true;
      } else if (player.resources.spice > 0) {
        player.resources.spice--;
        return true
      }
      return false;
    case "solari":
      if (add) {
        player.resources.solari++;
        return true
      } else if (player.resources.solari > 0) {
        player.resources.solari--;
        return true
      }
      return false;
  }
  return false;
}

export function addOrRemoveVP(game: GameModel, add: boolean) {
  const player = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )
  if (add) {
    player.victoryPoints++;
    return true;
  }
  else if (player.victoryPoints > 0) {
    player.victoryPoints--;
    return true;
  }

  return false;
}

function moveTroopToSupply(player: PlayerModel) {
  if (player.combat.troopsInCombat < 1) {
    showNotification("No troops participating in the conflict");
    return false;
  }

  player.combat.troopsInCombat--;
  player.combat.strength-=2;
  return true;
}

export function gainOrLoseAlliance(game: GameModel, gained: boolean, type: FactionType) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )
  const alreadyHasAlliance = thisPlayer.factionAlliances.find(fa => fa === type)

  if (gained && !alreadyHasAlliance) {
    thisPlayer.factionAlliances.push(type);
    return true;
  } else if (!gained && alreadyHasAlliance) {
    thisPlayer.factionAlliances = thisPlayer.factionAlliances.filter(fa => fa !== type);
    return true;
  }

  return false;
}

export function gainOrLoseObjective(game: GameModel, gained: boolean, type: ObjectiveType) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )

  if (gained) {
    thisPlayer.objectives.push(type);
    return true;
  } else if (!gained) {
    const index = thisPlayer.objectives.indexOf(type);
    thisPlayer.objectives.splice(index, 1);
    return true;
  }
}

export function canMoveComponent(game: GameModel, playerName: string) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )
  return thisPlayer.name === playerName;
}