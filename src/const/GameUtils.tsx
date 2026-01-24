import type {GameModel} from "../model/GameModel.tsx";
import type {UniqueIdentifier} from "@dnd-kit/core";
import {CombatUnitType, type ContractModel, FactionType, ObjectiveType, type PlayerModel, type TechModel} from "../model/PlayerModel.tsx";
import {showNotification} from "./Util.tsx";
import water_icon from "../assets/resources/water.png";
import spice_icon from "../assets/resources/spice.png";
import solari_icon from "../assets/resources/solari.png";
import troop_icon from "../assets/combat/troop.png";
import worm_icon from "../assets/combat/worm.png";
import sardaukar_icon from "../assets/combat/sardaukar_commander.png";
import strength_icon from "../assets/combat/strength.png";
import agent_icon_disabled from '../assets/agents/agent_disabled.svg';
import agent_icon_red from '../assets/agents/agent_red.svg';
import agent_icon_blue from '../assets/agents/agent_blue.svg';
import agent_icon_green from '../assets/agents/agent_green.svg';
import agent_icon_gold from '../assets/agents/agent_gold.svg';
import objective_desert_mouse from "../assets/objectives/desert_mouse_tr.png";
import objective_ornithopter from "../assets/objectives/ornithopter_tr.png";
import objective_cryskife from "../assets/objectives/crysknife_tr.png";
import objective_any from "../assets/objectives/any.png";
import troop_icon_red from "../assets/combat/troop_red.png";
import troop_icon_blue from "../assets/combat/troop_blue.png";
import troop_icon_green from "../assets/combat/troop_green.png";
import troop_icon_gold from "../assets/combat/troop_gold.png";

export const TroopMovementLocation = {
  Combat: "Combat", Garrison: "Garrison", Supply: "Supply",
} as const;
export type TroopMovementLocation = keyof typeof TroopMovementLocation;

export const getObjectiveIcon = (type: ObjectiveType) => {
  switch (type) {
    case ObjectiveType.DesertMouse:
      return objective_desert_mouse;
    case ObjectiveType.Ornithopter:
      return objective_ornithopter;
    case ObjectiveType.Crysknife:
      return objective_cryskife;
    case ObjectiveType.Any:
      return objective_any;
  }
}

export function assertExists<T>(value: T | undefined, message: string): T {
  if (value == null) throw new Error(message);
  return value;
}

export function hasAvailableAgent(player: PlayerModel) {
  return player.swordmasterUnlocked ? player.agents.length > 0 : player.agents.length > 1;
}

export const getAgentIcon = (color: string) => {
  if (color === "RED") return agent_icon_red;
  else if (color === "BLUE") return agent_icon_blue;
  else if (color === "GOLD") return agent_icon_gold;
  else if (color === "GREEN") return agent_icon_green;
  else return agent_icon_disabled;
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

export function setFactionInfluence(game: GameModel, playerName: string, factionType: FactionType, influence: number) {
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

export function setChaniSignetStatus(game: GameModel, newSignetStatus: number) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )
  thisPlayer.character.additionalInfo.signetStatus = newSignetStatus;
}

export function moveUnit(type: CombatUnitType, game: GameModel, destination: TroopMovementLocation) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    `This player not found.`
  )

  switch (destination) {
    case TroopMovementLocation.Combat:
      return type === CombatUnitType.Commander ? moveCommanderToCombat(thisPlayer) : moveTroopToCombat(thisPlayer);
    case TroopMovementLocation.Garrison:
      return type === CombatUnitType.Commander ? moveCommanderToGarrison(thisPlayer) : moveTroopToGarrison(thisPlayer);
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
  player.combat.strength += 2;
  player.combat.troopsInGarrison--;
  return true;
}

function moveCommanderToCombat(player: PlayerModel) {
  if (player.combat.commandersInGarrison < 1) {
    showNotification("No commanders available in garrison");
    return false;
  }

  player.combat.commandersInCombat++;
  player.combat.strength += 2;
  player.combat.commandersInGarrison--;
  return true;
}

function moveTroopToGarrison(player: PlayerModel) {
  if (player.combat.troopsInCombat < 1) {
    showNotification("No troops participating in the conflict");
    return false;
  }

  player.combat.troopsInCombat--;
  player.combat.strength -= 2;
  player.combat.troopsInGarrison++;
  return true;
}

function moveCommanderToGarrison(player: PlayerModel) {
  if (player.combat.commandersInCombat < 1) {
    showNotification("No commanders participating in the conflict");
    return false;
  }

  player.combat.commandersInCombat--;
  player.combat.strength -= 2;
  player.combat.commandersInGarrison++;
  return true;
}

export function addOrRemoveCombatUnit(
  playerName: string,
  game: GameModel,
  quantity: number,
  unit: CombatUnitType,
  add: boolean
) {
  const player = assertExists(
    game.players.find(p => p.name === playerName),
    `This player not found.`
  )

  switch (unit) {
    case CombatUnitType.Troop:
      if (add && player.combat.troopsInSupply >= quantity) {
        player.combat.troopsInGarrison+=quantity;
        player.combat.troopsInSupply-= quantity;
        return true;
      } else if (!add && player.combat.troopsInGarrison > 0) {
        const num = Math.max(player.combat.troopsInGarrison - quantity, 0);
        player.combat.troopsInSupply += player.combat.troopsInGarrison - num;
        player.combat.troopsInGarrison = num;
        return true;
      }
      return false;
    case CombatUnitType.Sandworm:
      if (add) {
        player.combat.wormsInCombat+=quantity;
        player.combat.strength += (3 * quantity);
        return true
      } else if (player.combat.wormsInCombat > 0) {
        player.combat.wormsInCombat = Math.max(player.combat.wormsInCombat - quantity, 0);
        player.combat.strength = Math.max(player.combat.strength - (3 * quantity), 0);
        return true
      }
      return false;
    case CombatUnitType.Commander:
      if (add && player.combat.commandersInSupply >= quantity) {
        player.combat.commandersInGarrison+=quantity;
        player.combat.commandersInSupply-=quantity;
        return true;
      } else if (!add && player.combat.commandersInGarrison > 0) {
        const num = Math.max(player.combat.commandersInGarrison - quantity, 0);
        player.combat.commandersInSupply += player.combat.commandersInGarrison - num;
        player.combat.commandersInGarrison = num;
        return true;
      }
      return false;
    case CombatUnitType.Strength:
      if (add) {
        player.combat.strength+=quantity;
        return true
      } else if (player.combat.strength > 0) {
        player.combat.strength = Math.max(player.combat.strength - quantity, 0);
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

export function addOrRemoveResource(playerName: string, game: GameModel, resourceType: string, quantity: number, add: boolean) {
  const player = assertExists(
    game.players.find(p => p.name === playerName),
    `This player not found.`
  )

  switch (resourceType) {
    case "water":
      if (add) {
        player.resources.water+=quantity;
        return true
      } else if (player.resources.water > 0) {
        player.resources.water=Math.max(player.resources.water - quantity, 0);
        return true
      }
      return false;
    case "spice":
      if (add) {
        player.resources.spice+=quantity;
        return true;
      } else if (player.resources.spice > 0) {
        player.resources.spice=Math.max(player.resources.spice - quantity, 0);
        return true
      }
      return false;
    case "solari":
      if (add) {
        player.resources.solari+=quantity;
        return true
      } else if (player.resources.solari > 0) {
        player.resources.solari=Math.max(player.resources.solari - quantity, 0);
        return true
      }
      return false;
  }
  return false;
}

export function addOrRemoveVP(playerName: string, game: GameModel, add: boolean) {
  const player = assertExists(
    game.players.find(p => p.name === playerName),
    `This player not found.`
  )
  if (add) {
    player.victoryPoints++;
    return true;
  } else if (player.victoryPoints > 0) {
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
  player.combat.strength -= 2;
  return true;
}

export function gainOrLoseAlliance(playerName: string, game: GameModel, gained: boolean, type: FactionType) {
  const thisPlayer = assertExists(
    game.players.find(p => p.name === playerName),
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

export function gainOrLoseObjective(playerName: string, game: GameModel, gained: boolean, type: ObjectiveType) {
  const thisPlayer = assertExists(
    game.players.find(p => p.name === playerName),
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

  const rivalPlayerNames = assertExists(
    game.players.filter(p => p.isRival).map(p => p.name),
    "This player not found"
  )
  return thisPlayer.name === playerName || rivalPlayerNames.includes(playerName);
}

export function acquireContract(game: GameModel, url: string) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )

  thisPlayer.contracts.push({
    url: url,
    completed: false,
  });
}

export function setContractCompleted(game: GameModel, contract: ContractModel, completed: boolean) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )

  const c = assertExists(
    thisPlayer.contracts.find(c => c.url === contract.url),
    `This contract ${contract.url} not found`
  )

  c.completed = completed;
}

export function flipTech(game: GameModel, tech: TechModel, flipped: boolean) {
  const thisPlayer = assertExists(
    game.players.find(p => p.isThisPlayer),
    "This player not found"
  )

  const c = assertExists(
    thisPlayer.techs.find(c => c.url === tech.url),
    `This contract ${tech.url} not found`
  )

  c.flipped = flipped;
}

export function getResourceIconByType(resourceType: string) {
  switch (resourceType) {
    case "water":
      return water_icon;
    case "spice":
      return spice_icon;
    default:
      return solari_icon
  }
}

export function getResourceQuantityByType(player: PlayerModel, resourceType: string) {
  switch (resourceType) {
    case "water":
      return player.resources.water;
    case "spice":
      return player.resources.spice;
    default:
      return player.resources.solari
  }
}

export function getResourceTextColorByType(resourceType: string) {
  switch (resourceType) {
    case "solari":
      return "black";
    default:
      return "white";
  }
}

export function getCombatUnitIconByType(modifierType: CombatUnitType) {
  switch (modifierType) {
    case CombatUnitType.Troop:
      return troop_icon;
    case CombatUnitType.Sandworm:
      return worm_icon;
      case CombatUnitType.Commander:
        return sardaukar_icon;
    default:
      return strength_icon;
  }
}

export const getColoredTroopIcon = (color: string) => {
  switch (color) {
    case "RED":
      return troop_icon_red;
    case "BLUE":
      return troop_icon_blue;
    case "GREEN":
      return troop_icon_green;
    default:
      return troop_icon_gold;
  }
}