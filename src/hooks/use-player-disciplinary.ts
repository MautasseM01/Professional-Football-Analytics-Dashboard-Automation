
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePlayerDisciplinary = (playerId: number | null) => {
  return useQuery({
    queryKey: ['player-disciplinary', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      
      const { data, error } = await supabase
        .from('player_disciplinary')
        .select('card_type')
        .eq('player_id', playerId);
      
      if (error) throw error;
      
      const yellowCards = data?.filter(record => record.card_type === 'Yellow').length || 0;
      const redCards = data?.filter(record => record.card_type === 'Red').length || 0;
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
      
      return {
        yellowCards,
        redCards,
        totalCards,
        riskLevel,
        riskColor
      };
    },
    enabled: !!playerId
  });
};
