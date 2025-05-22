
export interface PlayerPosition {
  id: number;
  name: string;
  number: number;
  position: string;
  x: number;
  y: number;
  totalPasses: number;
}

export interface PassConnection {
  from: number;
  to: number;
  count: number;
  direction: 'forward' | 'backward' | 'sideways';
  outcome: 'successful' | 'unsuccessful';
}

export interface Position {
  x: number;
  y: number;
}

export interface PassingNetworkProps {
  matchId: number;
  passDirectionFilter: string;
  passOutcomeFilter: string;
}
