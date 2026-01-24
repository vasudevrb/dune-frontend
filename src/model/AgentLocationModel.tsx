export interface AgentLocationModel {
  name: string;
  id: number;
  agents: {
    agentId: string;
    color: string;
    playerName: string
  }[];
  controlFlag?: {
    controlFlagId: string;
    color: string;
    playerName: string;
  }
}

const emptyLocation: AgentLocationModel = {
  name: "",
  id: 0,
  agents: [],
  controlFlag: undefined
}

export const locations: AgentLocationModel[] = [
  {
    ...emptyLocation,
    name: "Sardaukar",
    id: 1
  },
  {
    ...emptyLocation,
    name: "Dutiful Service",
    id: 2
  },
  {
    ...emptyLocation,
    name: "Heighliner",
    id: 3
  },
  {
    ...emptyLocation,
    name: "Deliver Supplies",
    id: 4
  },
  {
    ...emptyLocation,
    name: "Espionage",
    id: 5
  },
  {
    ...emptyLocation,
    name: "Secrets",
    id: 6
  },
  {
    ...emptyLocation,
    name: "Desert Tactics",
    id: 7
  },
  {
    ...emptyLocation,
    name: "Fremkit",
    id: 8
  },
  {
    ...emptyLocation,
    name: "Deep Desert",
    id: 9
  },
  {
    ...emptyLocation,
    name: "Hagga Basin",
    id: 10
  },
  {
    ...emptyLocation,
    name: "Imperial Basin",
    id: 11
  },
  {
    ...emptyLocation,
    name: "Sietch Tabr",
    id: 12
  },
  {
    ...emptyLocation,
    name: "Research Station",
    id: 13
  },
  {
    ...emptyLocation,
    name: "Spice Refinery",
    id: 14
  },
  {
    ...emptyLocation,
    name: "Arrakeen",
    id: 15
  },
  {
    ...emptyLocation,
    name: "High Council",
    id: 16
  },
  {
    ...emptyLocation,
    name: "Assembly Hall",
    id: 17
  },
  {
    ...emptyLocation,
    name: "Imperial Privilege",
    id: 18
  },
  {
    ...emptyLocation,
    name: "Swordmaster",
    id: 19
  },
  {
    ...emptyLocation,
    name: "Gather Support",
    id: 20
  },
  {
    ...emptyLocation,
    name: "Shipping",
    id: 21
  },
  {
    ...emptyLocation,
    name: "Accept Contract",
    id: 22
  },
  {
    ...emptyLocation,
    name: "Tuek's Sietch",
    id: 23
  }
]