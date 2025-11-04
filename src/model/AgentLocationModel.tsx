export interface AgentLocationModel {
  name: string;
  id: number;
  agents: {
    agentId: string;
    color: string;
    playerName: string
  }[]
}