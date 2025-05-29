
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useComplianceData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching compliance data...');

        // SAFE team_admin_status query (no .single())
        const { data: adminStatus, error: adminError } = await supabase
          .from('team_admin_status')
          .select('compliance_score, points_deducted, admin_violations')
          .eq('season', '2024-25')
          .order('last_updated', { ascending: false })
          .limit(1);

        // SAFE player_disciplinary query (correct schema)
        const { data: disciplinaryData, error: discError } = await supabase
          .from('player_disciplinary')
          .select('player_id, card_type, match_date, competition')
          .order('match_date', { ascending: false });

        // SAFE player_eligibility query (correct schema)  
        const { data: eligibilityData, error: eligError } = await supabase
          .from('player_eligibility')
          .select('player_id, is_eligible, registration_expires, suspension_until, notes');

        // SAFE players query
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('id, name, position');

        if (adminError || discError || eligError || playersError) {
          console.error('Query errors:', { adminError, discError, eligError, playersError });
          throw new Error('Failed to fetch compliance data');
        }

        // Process the data safely
        const adminData = adminStatus?.[0] || { compliance_score: 0, points_deducted: 0, admin_violations: [] };
        
        // Calculate players at risk from disciplinary records
        const cardCounts = {};
        disciplinaryData?.forEach(record => {
          if (!cardCounts[record.player_id]) {
            cardCounts[record.player_id] = { yellows: 0, reds: 0 };
          }
          if (record.card_type === 'yellow') cardCounts[record.player_id].yellows++;
          if (record.card_type === 'red') cardCounts[record.player_id].reds++;
        });

        const playersAtRisk = Object.entries(cardCounts)
          .filter(([playerId, cards]) => cards.yellows >= 4 || cards.reds > 0)
          .map(([playerId, cards]) => {
            const player = playersData?.find(p => p.id === parseInt(playerId));
            return {
              id: parseInt(playerId),
              name: player?.name || 'Unknown',
              yellows: cards.yellows,
              reds: cards.reds,
              risk: cards.yellows >= 4 ? 'High' : 'Medium'
            };
          });

        const result = {
          complianceScore: adminData.compliance_score,
          pointsDeducted: adminData.points_deducted,
          playersAtRisk: playersAtRisk.length,
          highRiskCount: playersAtRisk.length,
          playersAtRiskDetails: playersAtRisk,
          totalPlayers: playersData?.length || 0
        };

        console.log('Compliance data result:', result);
        setData(result);

      } catch (err) {
        setError(err.message);
        console.error('Compliance data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  return { data, isLoading, error };
};
