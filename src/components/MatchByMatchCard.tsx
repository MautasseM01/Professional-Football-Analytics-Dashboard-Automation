
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Target, Zap, Activity, Clock } from "lucide-react";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface MatchByMatchCardProps {
  player: Player;
}

export const MatchByMatchCard = ({ player }: MatchByMatchCardProps) => {
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 8);
  const { theme } = useTheme();

  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="p-6">
          <ErrorFallback 
            title="Match data error"
            description={`Failed to load match performance data: ${error}`}
          />
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "text-green-500";
    if (rating >= 7.5) return "text-club-gold";
    if (rating >= 6.5) return "text-blue-400";
    if (rating >= 5.5) return "text-gray-400";
    return "text-red-400";
  };

  const getRatingBadgeVariant = (rating: number): "default" | "secondary" | "destructive" | "outline" => {
    if (rating >= 8.5) return "default";
    if (rating >= 7.5) return "secondary";
    if (rating >= 6.5) return "outline";
    return "destructive";
  };

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-club-gold">
          <Calendar className="w-5 h-5" />
          Recent Match Performances
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 light:text-gray-600">
          Last {performances.length} match performances with detailed statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {performances.length > 0 ? (
          <div className="space-y-4">
            {performances.map((performance) => (
              <div 
                key={performance.id} 
                className="p-4 bg-club-black/10 light:bg-gray-50 rounded-lg border border-club-gold/10 hover:border-club-gold/30 transition-all duration-200"
              >
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-club-light-gray light:text-gray-900">
                      vs {performance.opponent}
                    </h3>
                    <p className="text-sm text-club-light-gray/70 light:text-gray-600">
                      {new Date(performance.match_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} • {performance.competition}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getRatingBadgeVariant(performance.match_rating)}
                      className="flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      {performance.match_rating.toFixed(1)}
                    </Badge>
                    {performance.player_of_match && (
                      <Badge variant="default" className="bg-club-gold text-club-black">
                        MOTM
                      </Badge>
                    )}
                    {performance.captain && (
                      <Badge variant="outline">Captain</Badge>
                    )}
                  </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-club-black/10 light:bg-white rounded">
                    <Clock className="w-4 h-4 text-club-gold" />
                    <div>
                      <p className="text-xs text-club-light-gray/70 light:text-gray-600">Minutes</p>
                      <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                        {performance.minutes_played}'
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-club-black/10 light:bg-white rounded">
                    <Target className="w-4 h-4 text-club-gold" />
                    <div>
                      <p className="text-xs text-club-light-gray/70 light:text-gray-600">G+A</p>
                      <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                        {performance.goals + performance.assists}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-club-black/10 light:bg-white rounded">
                    <Zap className="w-4 h-4 text-club-gold" />
                    <div>
                      <p className="text-xs text-club-light-gray/70 light:text-gray-600">Pass %</p>
                      <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                        {performance.pass_accuracy.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-club-black/10 light:bg-white rounded">
                    <Activity className="w-4 h-4 text-club-gold" />
                    <div>
                      <p className="text-xs text-club-light-gray/70 light:text-gray-600">Distance</p>
                      <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                        {performance.distance_covered.toFixed(1)}km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="mt-3 pt-3 border-t border-club-gold/10 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Goals</p>
                    <p className="text-sm font-semibold text-club-gold">{performance.goals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Assists</p>
                    <p className="text-sm font-semibold text-club-gold">{performance.assists}</p>
                  </div>
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Shots</p>
                    <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                      {performance.shots_on_target}/{performance.shots_total}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Passes</p>
                    <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                      {performance.passes_completed}/{performance.passes_attempted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Tackles</p>
                    <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                      {performance.tackles_won}/{performance.tackles_attempted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-club-light-gray/70 light:text-gray-600">Cards</p>
                    <p className="text-sm font-semibold text-club-light-gray light:text-gray-900">
                      <span className="text-yellow-500">{performance.yellow_cards}</span>
                      {performance.red_cards > 0 && (
                        <span className="text-red-500 ml-1">{performance.red_cards}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-club-light-gray/40 light:text-gray-400 mx-auto mb-4" />
            <p className="text-club-light-gray/60 light:text-gray-500">No match performances available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
