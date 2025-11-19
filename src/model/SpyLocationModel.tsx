export interface SpyLocationModel {
  id: number;
  locations: number[];
  spies: {
    spyId: string;
    color: string;
    playerName: string;
  }[];
}

const emptySpyLocation = {
  id: 0,
  locations: [],
  spies: []
}

export const spyLocations = [
  {
    ...emptySpyLocation,
    id: 1,
    locations: [1, 2]
  },
  {
    ...emptySpyLocation,
    id: 2,
    locations: [3, 4]
  },
  {
    ...emptySpyLocation,
    id: 3,
    locations: [5, 6]
  },
  {
    ...emptySpyLocation,
    id: 4,
    locations: [7, 8]
  },
  {
    ...emptySpyLocation,
    id: 5,
    locations: [9]
  },
  {
    ...emptySpyLocation,
    id: 6,
    locations: [10]
  },
  {
    ...emptySpyLocation,
    id: 7,
    locations: [11]
  },
  {
    ...emptySpyLocation,
    id: 8,
    locations: [12, 13]
  },
  {
    ...emptySpyLocation,
    id: 9,
    locations: [13, 14]
  },
  {
    ...emptySpyLocation,
    id: 10,
    locations: [14, 15]
  },
  {
    ...emptySpyLocation,
    id: 11,
    locations: [16, 18, 19]
  },
  {
    ...emptySpyLocation,
    id: 12,
    locations: [17, 20]
  },
  {
    ...emptySpyLocation,
    id: 13,
    locations: [21, 22]
  }
]