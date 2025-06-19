
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, FileText, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SuspensionRiskData {
  player_id: number;
  player_name: string;
  position: string;
  yellow_cards: number;
  risk_level: 'critical' | 'high' | 'medium';
}

const SuspensionRiskWidget = () => {
  const { data: riskData, isLoading } = useQuery({
    queryKey: ['suspension-risk'],
    queryFn: async () => {
      console.log('Fetching suspension risk data');
      
      // Get all disciplinary records with player info
      const { data: disciplinaryData, error } = await supabase
        .from('player_disciplinary')
        .select(`
          player_id,
          card_type,
          players!inner(name, position)
        `)
        .eq('card_type', 'Yellow');

      if (error) {
        console.error('Error fetching disciplinary data:', error);
        throw error;
      }

      // Group by player and count yellow cards
      const playerCards: Record<number, { name: string; position: string; yellows: number }> = {};
      
      disciplinaryData.forEach(record => {
        const playerId = record.player_id;
        if (!playerCards[playerId]) {
          playerCards[playerId] = {
            name: record.players?.name || 'Unknown',
            position: record.players?.position || 'Unknown',
            yellows: 0
          };
        }
        playerCards[playerId].yellows += 1;
      });

      // Filter players with 2+ yellow cards and determine risk level
      const atRiskPlayers: SuspensionRiskData[] = Object.entries(playerCards)
        .filter(([_, data]) => data.yellows >= 2)
        .map(([playerId, data]) => {
          let risk_level: 'critical' | 'high' | 'medium' = 'medium';
          if (data.yellows >= 4) risk_level = 'critical';
          else if (data.yellows === 3) risk_level = 'high';

          return {
            player_id: parseInt(playerId),
            player_name: data.name,
            position: data.position,
            yellow_cards: data.yellows,
            risk_level
          };
        })
        .sort((a, b) => b.yellow_cards - a.yellow_cards); // Sort by risk (highest first)

      console.log('Processed suspension risk data:', atRiskPlayers);
      return atRiskPlayers;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const getRiskColor = (riskLevel: 'critical' | 'high' | 'medium') => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskText = (riskLevel: 'critical' | 'high' | 'medium', yellows: number) => {
    switch (riskLevel) {
      case 'critical': return `${yellows} cards - One away from suspension`;
      case 'high': return `${yellows} cards - Two away from suspension`;
      case 'medium': return `${yellows} cards - Monitor closely`;
      default: return `${yellows} cards`;
    }
  };

  const criticalRiskCount = riskData?.filter(p => p.risk_level === 'critical').length || 0;

  if (isLoading) {
    return (
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Suspension Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-club-light-gray/70">Loading risk data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Suspension Risk Assessment
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Monitor players at risk of suspension for next match
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Match Impact Summary */}
        <div className="bg-club-black/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-club-gold" />
            <span className="text-club-light-gray font-medium">
              Players at risk for next match: {riskData?.length || 0}
            </span>
          </div>
          
          {criticalRiskCount > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-900/20 border border-red-600/30 rounded mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-400 text-sm font-medium">
                {criticalRiskCount} player{criticalRiskCount > 1 ? 's' : ''} at critical risk
              </span>
            </div>
          )}
        </div>

        {/* At-Risk Players List */}
        <div className="space-y-3">
          {riskData && riskData.length > 0 ? (
            riskData.map((player) => (
              <div key={player.player_id} className="flex items-center justify-between p-3 bg-club-black/20 rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(player.risk_level)}`}></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-club-light-gray">{player.player_name}</div>
                    <div className="text-sm text-club-light-gray/70">{player.position}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {getRiskText(player.risk_level, player.yellow_cards)}
                  </Badge>
                  {player.risk_level === 'critical' && (
                    <div className="text-xs text-red-400 mt-1">Next yellow = suspension</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Users className="h-12 w-12 text-club-gold/50 mx-auto mb-3" />
              <p className="text-club-light-gray">No players currently at suspension risk</p>
              <p className="text-club-light-gray/70 text-sm mt-1">All players have fewer than 2 yellow cards</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-club-gold/10 pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-club-black/30 border-club-gold/20 text-club-light-gray hover:bg-club-gold/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Full Compliance Report
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-club-black/30 border-club-gold/20 text-club-light-gray hover:bg-club-gold/10"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Alert to Assistant Coach
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuspensionRiskWidget;
