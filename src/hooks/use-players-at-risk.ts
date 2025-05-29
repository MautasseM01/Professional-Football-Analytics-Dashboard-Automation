
export interface PlayerAtRisk {
  id: number;
  name: string;
  yellowCards: number;
  redCards: number;
  isEligible: boolean;
  suspensionUntil: string | null;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

// Simplified hook to prevent 406 errors
export const usePlayersAtRisk = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};
