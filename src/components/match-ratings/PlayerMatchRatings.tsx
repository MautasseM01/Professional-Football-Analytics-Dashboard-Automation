
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchRating } from "@/hooks/use-match-ratings";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, TrendingDown } from "lucide-react";

interface PlayerMatchRatingsProps {
  ratings: MatchRating[];
}

export const PlayerMatchRatings = ({ ratings }: PlayerMatchRatingsProps) => {
  const [sortBy, setSortBy] = useState<string>("recent");

  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No player rating data available</p>
        </CardContent>
      </Card>
    );
  }

  // Extract man of the match and worst performer data
  const playerPerformances = ratings.flatMap(rating => {
    const performances = [];
    if (rating.man_of_match_name) {
      performances.push({
        playerName: rating.man_of_match_name,
        type: 'motm',
        matchDate: rating.match_date,
        opponent: rating.opponent,
        result: rating.result,
        overallRating: rating.overall_performance
      });
    }
    if (rating.worst_performer_name) {
      performances.push({
        playerName: rating.worst_performer_name,
        type: 'worst',
        matchDate: rating.match_date,
        opponent: rating.opponent,
        result: rating.result,
        overallRating: rating.overall_performance
      });
    }
    return performances;
  });

  // Group by player and calculate stats
  const playerStats = playerPerformances.reduce((acc, perf) => {
    if (!acc[perf.playerName]) {
      acc[perf.playerName] = {
        name: perf.playerName,
        motmCount: 0,
        worstCount: 0,
        appearances: 0,
        lastMatch: perf.matchDate
      };
    }
    
    acc[perf.playerName].appearances += 1;
    if (perf.type === 'motm') acc[perf.playerName].motmCount += 1;
    if (perf.type === 'worst') acc[perf.playerName].worstCount += 1;
    
    if (new Date(perf.matchDate) > new Date(acc[perf.playerName].lastMatch)) {
      acc[perf.playerName].lastMatch = perf.matchDate;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const sortedPlayers = Object.values(playerStats).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'motm':
        return b.motmCount - a.motmCount;
      case 'worst':
        return b.worstCount - a.worstCount;
      case 'appearances':
        return b.appearances - a.appearances;
      default:
        return new Date(b.lastMatch).getTime() - new Date(a.lastMatch).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Player Performance Tracking</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="motm">Man of Match</SelectItem>
                <SelectItem value="worst">Poor Performance</SelectItem>
                <SelectItem value="appearances">Appearances</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPlayers.map((player: any) => (
              <div key={player.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Last appearance: {new Date(player.lastMatch).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {player.motmCount > 0 && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {player.motmCount} MOTM
                    </Badge>
                  )}
                  {player.worstCount > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {player.worstCount}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {player.appearances} mentions
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Performances Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {playerPerformances
              .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
              .slice(0, 20)
              .map((perf, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{perf.playerName}</span>
                      {perf.type === 'motm' ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Man of Match
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Poor Performance
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {perf.opponent} ({perf.result}) • {new Date(perf.matchDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {perf.overallRating.toFixed(1)}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
