
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchRating } from "@/hooks/use-match-ratings";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, TrendingDown, Star, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface PlayerMatchRatingsProps {
  ratings: MatchRating[];
}

export const PlayerMatchRatings = ({ ratings }: PlayerMatchRatingsProps) => {
  const [sortBy, setSortBy] = useState<string>("recent");
  const { theme } = useTheme();

  if (ratings.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Star className="w-5 h-5" />
            Player Match Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <Star className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400" />
            <div>
              <p className="text-club-light-gray light:text-gray-700">No player rating data available</p>
              <p className="text-sm text-club-light-gray/60 light:text-gray-500 mt-1">
                Player ratings have not been recorded yet
              </p>
            </div>
          </div>
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
      case "motm":
        return b.motmCount - a.motmCount;
      case "worst":
        return b.worstCount - a.worstCount;
      case "recent":
      default:
        return new Date(b.lastMatch).getTime() - new Date(a.lastMatch).getTime();
    }
  });

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Star className="w-5 h-5" />
            Player Match Ratings
          </CardTitle>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="motm">Most MOTM</SelectItem>
              <SelectItem value="worst">Most Worst</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player: any, index) => (
            <div 
              key={player.name} 
              className="flex items-center justify-between p-4 bg-club-black/20 light:bg-gray-100 rounded-lg border border-club-gold/10 light:border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-club-gold/20 rounded-full flex items-center justify-center text-sm font-bold text-club-gold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-club-light-gray light:text-gray-900">{player.name}</h3>
                  <p className="text-sm text-club-light-gray/60 light:text-gray-500">
                    Last appearance: {new Date(player.lastMatch).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-yellow-500">{player.motmCount}</span>
                  </div>
                  <div className="text-xs text-club-light-gray/60 light:text-gray-500">MOTM</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-red-500">{player.worstCount}</span>
                  </div>
                  <div className="text-xs text-club-light-gray/60 light:text-gray-500">Worst</div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-club-light-gray light:text-gray-900">{player.appearances}</div>
                  <div className="text-xs text-club-light-gray/60 light:text-gray-500">Total</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-club-light-gray/60 light:text-gray-500">No individual player ratings available</p>
          </div>
        )}

        {/* Recent Performances */}
        <div className="border-t border-club-gold/20 pt-6">
          <h3 className="text-lg font-semibold text-club-gold mb-4">Recent Outstanding Performances</h3>
          <div className="space-y-3">
            {playerPerformances.slice(0, 5).map((perf, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-club-black/10 light:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={perf.type === 'motm' ? 'default' : 'destructive'}
                    className={perf.type === 'motm' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                  >
                    {perf.type === 'motm' ? 'MOTM' : 'Worst'}
                  </Badge>
                  <div>
                    <span className="font-medium text-club-light-gray light:text-gray-900">{perf.playerName}</span>
                    <span className="text-sm text-club-light-gray/60 light:text-gray-500 ml-2">
                      vs {perf.opponent}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-club-light-gray light:text-gray-900">
                    {new Date(perf.matchDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-club-light-gray/60 light:text-gray-500">
                    Team: {perf.overallRating.toFixed(1)}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
