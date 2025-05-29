
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComplianceData = () => {
  return useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      console.log('Fetching compliance data...');
      
      // Fix team_admin_status query to handle multiple rows properly
      let { data: adminStatus, error: adminError } = await supabase
        .from('team_admin_status')
        .select('compliance_score, points_deducted, admin_violations')
        .eq('season', '2024-25')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();
      
      // If no current season data exists, get the most recent row
      if (adminError || !adminStatus) {
        console.log('No current season data found, fetching most recent...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('team_admin_status')
          .select('compliance_score, points_deducted, admin_violations')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();
        
        if (fallbackError) {
          console.error('Error fetching team admin status:', fallbackError);
          throw fallbackError;
        }
        
        adminStatus = fallbackData;
      }
      
      // Fix player_eligibility query to use correct schema
      const { data: ineligiblePlayersData, error: ineligiblePlayersError } = await supabase
        .from('player_eligibility')
        .select('player_id, is_eligible, registration_expires, suspension_until, notes')
        .eq('is_eligible', false);
      
      if (ineligiblePlayersError) {
        console.error('Error fetching ineligible players:', ineligiblePlayersError);
        throw ineligiblePlayersError;
      }
      
      // Fix player_disciplinary query to use correct schema
      const { data: disciplinaryData, error: disciplinaryError } = await supabase
        .from('player_disciplinary')
        .select('player_id, card_type, match_date, competition')
        .order('match_date', { ascending: false });
      
      if (disciplinaryError) {
        console.error('Error fetching disciplinary data:', disciplinaryError);
        throw disciplinaryError;
      }
      
      // Process disciplinary data correctly
      const playersAtRisk = disciplinaryData?.reduce((acc: Record<number, { yellows: number; reds: number; playerId: number }>, record) => {
        if (!acc[record.player_id]) {
          acc[record.player_id] = { yellows: 0, reds: 0, playerId: record.player_id };
        }
        if (record.card_type === 'yellow') {
          acc[record.player_id].yellows++;
        } else if (record.card_type === 'red') {
          acc[record.player_id].reds++;
        }
        return acc;
      }, {}) || {};
      
      // Get players at risk (4+ yellow cards or recent red card)
      const atRiskPlayers = Object.values(playersAtRisk).filter(player => 
        player.yellows >= 4 || player.reds > 0
      );
      
      const highRiskCount = atRiskPlayers.length;
      
      const result = {
        complianceScore: adminStatus?.compliance_score || 0,
        pointsDeducted: adminStatus?.points_deducted || 0,
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
