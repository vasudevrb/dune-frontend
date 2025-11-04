import type {GameModel} from "../model/GameModel.tsx";

export function getAgent(game: GameModel, agentId: string) {
 return game.players
   .flatMap(player => player.agents)
   .find(agent => agent.id === agentId)
}

function assertExists<T>(value: T | undefined, message: string): T {
  if (value == null) throw new Error(message);
  return value;
}

export function placeAgent(game: GameModel, agentId: string, locationId: number) {
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