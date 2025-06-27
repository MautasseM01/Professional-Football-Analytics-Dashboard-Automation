
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerEligibilityData {
  id: number;
  player_id: number;
  is_eligible: boolean;
  suspension_until?: string;
  registration_date?: string;
  registration_expires?: string;
  notes?: string;
}

export const usePlayerEligibility = (playerId?: number) => {
  return useQuery({
    queryKey: ['player-eligibility', playerId],
    queryFn: async (): Promise<PlayerEligibilityData | null> => {
      if (!playerId) return null;
      
      console.log('Fetching player eligibility for player:', playerId);
      
      const { data, error } = await supabase
        .from('player_eligibility')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching player eligibility:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get eligibility status for all players
export const useAllPlayersEligibility = () => {
  return useQuery({
    queryKey: ['all-players-eligibility'],
    queryFn: async (): Promise<PlayerEligibilityData[]> => {
      console.log('Fetching eligibility for all players');
      
      const { data, error } = await supabase
        .from('player_eligibility')
        .select('*')
        .order('player_id');
      
      if (error) {
        console.error('Error fetching all players eligibility:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
