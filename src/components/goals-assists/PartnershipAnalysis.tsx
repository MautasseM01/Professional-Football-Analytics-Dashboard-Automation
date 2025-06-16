
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
    <Card>
      <CardHeader>
        <CardTitle>Partnership Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partnershipData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No partnership data available</p>
          ) : (
            <>
              <div className="space-y-3">
                <h4 className="font-medium">Most Effective Partnerships</h4>
                {partnershipData.slice(0, 5).map((partnership, index) => (
                  <div key={partnership.partner} className="p-3 rounded border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{partnership.partner}</span>
                      </div>
                      <Badge variant="outline">{partnership.goals} goals</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{partnership.matches} matches together</span>
                      <span>{partnership.efficiency} goals/match</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {goals.filter(g => g.assisted_by_name).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Assisted Goals</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {Object.keys(assistPartnerships).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Partners</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {assists.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Assists Given</div>
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
