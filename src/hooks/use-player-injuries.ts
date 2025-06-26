
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerInjury {
  id: number;
  player_id: number;
  injury_type: string;
  injury_date: string;
  expected_return_date: string | null;
  status: 'active' | 'recovering' | 'fit';
  severity: 'minor' | 'moderate' | 'major';
  body_part: string;
  notes: string | null;
}

export const usePlayerInjuries = () => {
  return useQuery({
    queryKey: ['player-injuries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_injuries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching player injuries:', error);
        throw error;
      }

      return data as PlayerInjury[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlayerInjuryStatus = (playerId: number) => {
  return useQuery({
    queryKey: ['player-injury-status', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_injuries')
        .select('*')
        .eq('player_id', playerId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching player injury status:', error);
        throw error;
      }

      return data as PlayerInjury | null;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
