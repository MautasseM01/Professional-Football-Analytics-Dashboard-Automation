
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerAtRisk {
  id: number;
  name: string;
  position: string;
  yellowCards: number;
  redCards: number;
  isEligible: boolean;
  suspensionUntil: string | null;
  riskLevel: 'HIGH' | 'SUSPENDED' | 'WARNING';
  reason: string;
  lastCardDate: string | null;
}

export const usePlayersAtRisk = () => {
  return useQuery({
    queryKey: ['players-at-risk'],
    queryFn: async () => {
      console.log('Fetching players at risk data...');
      
      // First, get all disciplinary records with player info
      const { data: disciplinaryData, error: disciplinaryError } = await supabase
        .from('player_disciplinary')
        .select(`
          player_id,
          card_type,
          match_date,
          players (
            id,
            name,
            position
          )
        `)
        .not('players', 'is', null);

      if (disciplinaryError) {
        console.error('Error fetching disciplinary data:', disciplinaryError);
        throw disciplinaryError;
      }

      console.log('Raw disciplinary data:', disciplinaryData);

      // Get player eligibility data
      const { data: eligibilityData, error: eligibilityError } = await supabase
        .from('player_eligibility')
        .select('player_id, is_eligible, suspension_until');

      if (eligibilityError) {
        console.error('Error fetching eligibility data:', eligibilityError);
        // Don't throw, just log and continue with empty eligibility data
      }

      console.log('Eligibility data:', eligibilityData);

      // Process the data to calculate risk levels
      const playerMap = new Map<number, {
        id: number;
        name: string;
        position: string;
        yellowCards: number;
        redCards: number;
        lastCardDate: string | null;
        isEligible: boolean;
        suspensionUntil: string | null;
      }>();

      // Group cards by player
      disciplinaryData?.forEach(record => {
        if (record.players && record.card_type) {
          const playerId = record.player_id;
          const player = record.players;
          
          if (!playerMap.has(playerId)) {
            playerMap.set(playerId, {
              id: playerId,
              name: player.name || 'Unknown Player',
              position: player.position || 'Unknown',
              yellowCards: 0,
              redCards: 0,
              lastCardDate: null,
              isEligible: true,
              suspensionUntil: null
            });
          }

          const playerData = playerMap.get(playerId)!;
          
          // Count cards (case insensitive)
          if (record.card_type.toLowerCase() === 'yellow') {
            playerData.yellowCards++;
          } else if (record.card_type.toLowerCase() === 'red') {
            playerData.redCards++;
          }

          // Track most recent card date
          if (record.match_date) {
            if (!playerData.lastCardDate || record.match_date > playerData.lastCardDate) {
              playerData.lastCardDate = record.match_date;
            }
          }
        }
      });

      // Add eligibility information
      eligibilityData?.forEach(eligibility => {
        const playerData = playerMap.get(eligibility.player_id);
        if (playerData) {
          playerData.isEligible = eligibility.is_eligible ?? true;
          playerData.suspensionUntil = eligibility.suspension_until;
        }
      });

      // Filter and categorize players at risk
      const playersAtRisk: PlayerAtRisk[] = [];

      playerMap.forEach(player => {
        const totalCards = player.yellowCards + player.redCards;
        let riskLevel: 'HIGH' | 'SUSPENDED' | 'WARNING' = 'WARNING';
        let reason = '';

        // Determine risk level
        if (!player.isEligible || player.redCards > 0) {
          riskLevel = 'SUSPENDED';
          if (player.redCards > 0) {
            reason = `${player.redCards} red card(s) - Suspended`;
          } else {
            reason = 'Player marked as ineligible';
          }
        } else if (player.yellowCards >= 4) {
          riskLevel = 'HIGH';
          reason = `${player.yellowCards} yellow cards - Next yellow = suspension`;
        } else if (player.yellowCards >= 2) {
          riskLevel = 'WARNING';
          reason = `${player.yellowCards} yellow cards - Approaching threshold`;
        }

        // Only include players with risk (2+ cards or suspended)
        if (totalCards >= 2 || !player.isEligible || player.redCards > 0) {
          playersAtRisk.push({
            id: player.id,
            name: player.name,
            position: player.position,
            yellowCards: player.yellowCards,
            redCards: player.redCards,
            isEligible: player.isEligible,
            suspensionUntil: player.suspensionUntil,
            riskLevel,
            reason,
            lastCardDate: player.lastCardDate
          });
        }
      });

      // Sort by risk level (suspended first, then high risk, then warning)
      playersAtRisk.sort((a, b) => {
        const riskOrder = { 'SUSPENDED': 3, 'HIGH': 2, 'WARNING': 1 };
        const aOrder = riskOrder[a.riskLevel];
        const bOrder = riskOrder[b.riskLevel];
        
        if (aOrder !== bOrder) {
          return bOrder - aOrder; // Higher risk first
        }
        
        // Same risk level, sort by total cards
        const aTotalCards = a.yellowCards + a.redCards;
        const bTotalCards = b.yellowCards + b.redCards;
        return bTotalCards - aTotalCards;
      });

      console.log('Processed players at risk:', playersAtRisk);
      return playersAtRisk;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
