
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchRating } from "@/hooks/use-match-ratings";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

interface OppositionAnalysisProps {
  ratings: MatchRating[];
}

export const OppositionAnalysis = ({ ratings }: OppositionAnalysisProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No opposition analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  // Group ratings by opponent
  const opponentStats = ratings.reduce((acc, rating) => {
    const opponent = rating.opponent;
    if (!acc[opponent]) {
      acc[opponent] = {
        name: opponent,
        matches: 0,
        totalRating: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        avgAttacking: 0,
        avgDefensive: 0,
        avgPossession: 0,
        avgTactical: 0,
        totalAttacking: 0,
        totalDefensive: 0,
        totalPossession: 0,
        totalTactical: 0,
        difficultyRating: 0,
        totalDifficulty: 0
      };
    }
    
    acc[opponent].matches += 1;
    acc[opponent].totalRating += rating.overall_performance;
    acc[opponent].totalAttacking += rating.attacking_rating;
    acc[opponent].totalDefensive += rating.defensive_rating;
    acc[opponent].totalPossession += rating.possession_rating;
    acc[opponent].totalTactical += rating.tactical_execution;
    acc[opponent].totalDifficulty += rating.opponent_difficulty;
    
    if (rating.result.includes('W')) acc[opponent].wins += 1;
    else if (rating.result.includes('D')) acc[opponent].draws += 1;
    else acc[opponent].losses += 1;
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.values(opponentStats).forEach((stat: any) => {
    stat.avgRating = stat.totalRating / stat.matches;
    stat.avgAttacking = stat.totalAttacking / stat.matches;
    stat.avgDefensive = stat.totalDefensive / stat.matches;
    stat.avgPossession = stat.totalPossession / stat.matches;
    stat.avgTactical = stat.totalTactical / stat.matches;
    stat.difficultyRating = stat.totalDifficulty / stat.matches;
    stat.winRate = (stat.wins / stat.matches) * 100;
  });

  const opponentChartData = Object.values(opponentStats)
    .sort((a: any, b: any) => b.avgRating - a.avgRating);

  const bestPerformances = opponentChartData.slice(0, 5);
  const worstPerformances = opponentChartData.slice(-5).reverse();

  const getResultBadge = (stat: any) => {
    if (stat.winRate >= 66) return { variant: 'default', color: 'text-green-500' };
    if (stat.winRate >= 33) return { variant: 'secondary', color: 'text-yellow-500' };
    return { variant: 'destructive', color: 'text-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Performance vs Opposition Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance vs Opposition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opponentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: any, name) => [value.toFixed(1), 'Average Rating']}
                  labelFormatter={(label) => `vs ${label}`}
                />
                <Bar dataKey="avgRating" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Best Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestPerformances.map((stat: any) => (
                <div key={stat.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">{stat.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.matches} match{stat.matches > 1 ? 'es' : ''} • 
                      Win rate: {stat.winRate.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-500">
                      {stat.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Difficulty: {stat.difficultyRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Challenging Opponents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Challenging Opponents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {worstPerformances.map((stat: any) => (
                <div key={stat.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">{stat.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.matches} match{stat.matches > 1 ? 'es' : ''} • 
                      Win rate: {stat.winRate.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-500">
                      {stat.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Difficulty: {stat.difficultyRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Opposition Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Opposition Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {opponentChartData.map((stat: any) => {
              const badge = getResultBadge(stat);
              return (
                <div key={stat.name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stat.name}</span>
                      <Badge variant={badge.variant as any}>
                        {stat.wins}W-{stat.draws}D-{stat.losses}L
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>Attack: {stat.avgAttacking.toFixed(1)}</div>
                      <div>Defense: {stat.avgDefensive.toFixed(1)}</div>
                      <div>Possession: {stat.avgPossession.toFixed(1)}</div>
                      <div>Tactical: {stat.avgTactical.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${badge.color}`}>
                      {stat.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.winRate.toFixed(0)}% win rate
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
