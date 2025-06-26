
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerContract {
  id: number;
  player_id: number;
  contract_start_date: string;
  contract_end_date: string;
  salary_per_week: number | null;
  contract_type: string;
  status: string;
}

export const usePlayerContract = (playerId: number) => {
  return useQuery({
    queryKey: ['player-contract', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_contracts')
        .select('*')
        .eq('player_id', playerId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching player contract:', error);
        throw error;
      }

      return data as PlayerContract | null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
