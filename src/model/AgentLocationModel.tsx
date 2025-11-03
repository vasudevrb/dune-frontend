import type {AgentModel} from "./PlayerModel.tsx";

export class AgentLocationModel {
  name: string;
  id: number;
  agents: AgentModel[] = []

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  placeAgent(agent: AgentModel) {
    this.agents.push(agent);
  }

  recallAgent(agent: AgentModel) {
    this.agents.splice(this.agents.indexOf(agent), 1);
  }
}