
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Badge } from "@/components/ui/badge";

interface PartnershipAnalysisProps {
  player: Player;
}

export const PartnershipAnalysis = ({ player }: PartnershipAnalysisProps) => {
  const { goals, assists, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Partnerships where this player scored and someone assisted
  const assistPartnerships = goals.filter(goal => goal.assisted_by_name).reduce((acc, goal) => {
    const partner = goal.assisted_by_name!;
    if (!acc[partner]) {
      acc[partner] = { goals: 0, matches: new Set() };
    }
    acc[partner].goals += 1;
    acc[partner].matches.add(goal.match_id);
    return acc;
  }, {} as Record<string, { goals: number; matches: Set<number> }>);

  const partnershipData = Object.entries(assistPartnerships).map(([partner, data]) => ({
    partner,
    goals: data.goals,
    matches: data.matches.size,
    efficiency: data.matches.size > 0 ? Number((data.goals / data.matches.size).toFixed(2)) : 0
  })).sort((a, b) => b.goals - a.goals);

  return (
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Partnership Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partnershipData.length === 0 ? (
            <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-center py-8">No partnership data available</p>
          ) : (
            <>
              <div className="space-y-3">
                <h4 className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-900">Most Effective Partnerships</h4>
                {partnershipData.slice(0, 5).map((partnership, index) => (
                  <div key={partnership.partner} className="p-4 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"} 
                               className={index === 0 ? "bg-club-gold text-club-black" : "bg-club-gold/20 text-club-gold border-club-gold/30"}>
                          #{index + 1}
                        </Badge>
                        <span className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-900">{partnership.partner}</span>
                      </div>
                      <Badge variant="outline" className="border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                        {partnership.goals} goals
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                      <span>{partnership.matches} matches together</span>
                      <span><span className="text-club-gold dark:text-club-gold light:text-yellow-600 font-medium">{partnership.efficiency}</span> goals/match</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="pt-4 border-t border-club-gold/10 dark:border-club-gold/10 light:border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                    <div className="text-lg font-bold text-club-gold dark:text-club-gold light:text-green-600">
                      {goals.filter(g => g.assisted_by_name).length}
                    </div>
                    <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Assisted Goals</div>
                  </div>
                  <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                    <div className="text-lg font-bold text-club-gold dark:text-club-gold light:text-blue-600">
                      {Object.keys(assistPartnerships).length}
                    </div>
                    <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Partners</div>
                  </div>
                  <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                    <div className="text-lg font-bold text-club-gold dark:text-club-gold light:text-purple-600">
                      {assists.length}
                    </div>
                    <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Assists Given</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
