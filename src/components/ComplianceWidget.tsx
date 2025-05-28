
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ComplianceWidget = () => {
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['team-compliance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_admin_status')
        .select('compliance_score, points_deducted')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: highRiskPlayers, isLoading: playersLoading } = useQuery({
    queryKey: ['high-risk-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_disciplinary')
        .select('player_id, card_type')
        .eq('card_type', 'Yellow');
      
      if (error) throw error;
      
      // Count yellow cards per player
      const playerCardCounts = data.reduce((acc: Record<number, number>, record) => {
        acc[record.player_id] = (acc[record.player_id] || 0) + 1;
        return acc;
      }, {});
      
      // Count players with 4+ yellow cards
      const highRiskCount = Object.values(playerCardCounts).filter(count => count >= 4).length;
      return highRiskCount;
    }
  });

  if (isLoading || playersLoading) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader className="pb-3">
          <CardTitle className="text-club-gold text-lg">Team Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20 bg-club-gold/10" />
            <Skeleton className="h-6 w-20 bg-club-gold/10" />
            <Skeleton className="h-6 w-20 bg-club-gold/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-lg">Team Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-club-gold">
              {complianceData?.compliance_score || 0}%
            </p>
            <p className="text-xs text-club-light-gray/70">Compliance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-club-gold">
              {highRiskPlayers || 0}
            </p>
            <p className="text-xs text-club-light-gray/70">High Risk</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-club-gold">
              {complianceData?.points_deducted || 0}
            </p>
            <p className="text-xs text-club-light-gray/70">Points Lost</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
