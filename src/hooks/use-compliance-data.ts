
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComplianceData = () => {
  return useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      console.log('Fetching compliance data...');
      
      // Fetch team admin status
      const { data: teamAdminData, error: teamAdminError } = await supabase
        .from('team_admin_status')
        .select('compliance_score, points_deducted')
        .single();
      
      if (teamAdminError) {
        console.error('Error fetching team admin status:', teamAdminError);
        throw teamAdminError;
      }
      
      // Fetch ineligible players count
      const { data: ineligiblePlayersData, error: ineligiblePlayersError } = await supabase
        .from('player_eligibility')
        .select('player_id')
        .eq('is_eligible', false);
      
      if (ineligiblePlayersError) {
        console.error('Error fetching ineligible players:', ineligiblePlayersError);
        throw ineligiblePlayersError;
      }
      
      // Fetch disciplinary data for high-risk players (4+ yellow cards)
      const { data: disciplinaryData, error: disciplinaryError } = await supabase
        .from('player_disciplinary')
        .select('player_id, card_type');
      
      if (disciplinaryError) {
        console.error('Error fetching disciplinary data:', disciplinaryError);
        throw disciplinaryError;
      }
      
      // Count yellow cards per player
      const playerCardCounts = disciplinaryData.reduce((acc: Record<number, number>, record) => {
        if (record.card_type === 'yellow') {
          acc[record.player_id] = (acc[record.player_id] || 0) + 1;
        }
        return acc;
      }, {});
      
      // Count players with 4+ yellow cards
      const highRiskCount = Object.values(playerCardCounts).filter(count => count >= 4).length;
      
      const result = {
        complianceScore: teamAdminData?.compliance_score || 0,
        pointsDeducted: teamAdminData?.points_deducted || 0,
        playersAtRisk: ineligiblePlayersData?.length || 0,
        highRiskCount
      };
      
      console.log('Compliance data result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
