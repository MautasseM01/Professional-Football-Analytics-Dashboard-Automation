
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePlayerDisciplinary = (playerId: number | null) => {
  return useQuery({
    queryKey: ['player-disciplinary', playerId],
    queryFn: async () => {
      if (!playerId) {
        console.log('No player ID provided to usePlayerDisciplinary');
        return null;
      }
      
      console.log('Fetching disciplinary data for player ID:', playerId);
      
      const { data, error } = await supabase
        .from('player_disciplinary')
        .select('card_type')
        .eq('player_id', playerId);
      
      if (error) {
        console.error('Error fetching disciplinary data:', error);
        throw error;
      }
      
      console.log('Disciplinary data for player', playerId, ':', data);
      
      // Fix: Use lowercase to match your database values
      const yellowCards = data?.filter(record => record.card_type === 'yellow').length || 0;
      const redCards = data?.filter(record => record.card_type === 'red').length || 0;
      const totalCards = yellowCards + redCards;
      
      let riskLevel: 'SAFE' | 'AT RISK' | 'CRITICAL' = 'SAFE';
      let riskColor = 'text-green-500';
      
      if (totalCards >= 5) {
        riskLevel = 'CRITICAL';
        riskColor = 'text-red-500';
      } else if (totalCards === 4) {
        riskLevel = 'AT RISK';
        riskColor = 'text-amber-500';
      }
      
      const result = {
        yellowCards,
        redCards,
        totalCards,
        riskLevel,
        riskColor
      };
      
      console.log('Processed disciplinary result for player', playerId, ':', result);
      return result;
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
  });
};
