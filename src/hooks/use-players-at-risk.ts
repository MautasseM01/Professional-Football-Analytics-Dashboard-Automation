
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const usePlayersAtRisk = () => {
  return useQuery({
    queryKey: ['players-at-risk'],
    queryFn: async () => {
      console.log('Fetching players at risk data...');
      
      // Fetch players with their disciplinary records
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, name');
      
      if (playersError) {
        console.error('Error fetching players:', playersError);
        throw playersError;
      }
      
      // Fetch all disciplinary records
      const { data: disciplinaryData, error: disciplinaryError } = await supabase
        .from('player_disciplinary')
        .select('player_id, card_type');
      
      if (disciplinaryError) {
        console.error('Error fetching disciplinary data:', disciplinaryError);
        throw disciplinaryError;
      }
      
      // Fetch eligibility data
      const { data: eligibilityData, error: eligibilityError } = await supabase
        .from('player_eligibility')
        .select('player_id, is_eligible, suspension_until');
      
      if (eligibilityError) {
        console.error('Error fetching eligibility data:', eligibilityError);
        throw eligibilityError;
      }
      
      // Process the data
      const playersAtRisk: PlayerAtRisk[] = [];
      
      for (const player of players) {
        // Count cards for this player
        const playerCards = disciplinaryData.filter(d => d.player_id === player.id);
        const yellowCards = playerCards.filter(d => d.card_type === 'yellow').length;
        const redCards = playerCards.filter(d => d.card_type === 'red').length;
        
        // Get eligibility info
        const eligibility = eligibilityData.find(e => e.player_id === player.id);
        const isEligible = eligibility?.is_eligible ?? true;
        const suspensionUntil = eligibility?.suspension_until || null;
        
        // Determine if player is at risk
        const isAtRisk = yellowCards >= 4 || !isEligible;
        
        if (isAtRisk) {
          let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
          let reason = '';
          
          if (!isEligible && suspensionUntil) {
            riskLevel = 'HIGH';
            reason = `Suspended until ${new Date(suspensionUntil).toLocaleDateString()}`;
          } else if (!isEligible) {
            riskLevel = 'HIGH';
            reason = 'Ineligible';
          } else if (yellowCards >= 5) {
            riskLevel = 'HIGH';
            reason = `${yellowCards} yellow cards`;
          } else if (yellowCards === 4) {
            riskLevel = 'MEDIUM';
            reason = '4 yellow cards';
          }
          
          playersAtRisk.push({
            id: player.id,
            name: player.name || `Player ${player.id}`,
            yellowCards,
            redCards,
            isEligible,
            suspensionUntil,
            riskLevel,
            reason
          });
        }
      }
      
      console.log('Players at risk result:', playersAtRisk);
      return playersAtRisk;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
