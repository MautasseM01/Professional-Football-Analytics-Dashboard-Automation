
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { Calendar, Target, Users, Zap, Activity, Loader } from "lucide-react";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface MatchByMatchCardProps {
  player: Player;
}

export const MatchByMatchCard = ({ player }: MatchByMatchCardProps) => {
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 10);
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          {/* TODO: Add translation */}
          Match-by-Match Performance
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {/* TODO: Add translation */}
          Recent match performances and statistics
        </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">{/* TODO: Add translation */}Loading match performances...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          {/* TODO: Add translation */}
          Match-by-Match Performance
        </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ErrorFallback 
            title="Match performance error"
            description={`Failed to load match performances: ${error}`}
          />
        </CardContent>
      </Card>
    );
  }

  if (!performances || performances.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          {/* TODO: Add translation */}
          Match-by-Match Performance
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {/* TODO: Add translation */}
          Recent match performances and statistics
        </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <div>
              <p className="text-foreground">{/* TODO: Add translation */}No match performances available</p>
              <p className="text-sm text-muted-foreground mt-1">
                {/* TODO: Add translation */}No recent match data has been recorded for this player
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getResultBadgeColor = (result: string) => {
    if (result.includes('W')) return 'bg-green-500 hover:bg-green-600';
    if (result.includes('D')) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-red-500 hover:bg-red-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 7) return 'text-blue-500';
    if (rating >= 6) return 'text-yellow-500';
    if (rating >= 5) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="w-5 h-5" />
          {/* TODO: Add translation */}
          Match-by-Match Performance
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {/* TODO: Add translation */}
          Recent match performances and statistics (Last {performances.length} matches)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {performances.map((performance) => (
          <div 
            key={performance.id} 
            className="p-4 bg-accent/10 rounded-lg border border-border"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">
                  {performance.opponent}
                </h3>
                <Badge className={`${getResultBadgeColor(performance.result)} text-white text-xs`}>
                  {performance.result}
                </Badge>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getRatingColor(performance.match_rating)}`}>
                  {performance.match_rating > 0 ? performance.match_rating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Minutes</div>
                <div className="font-medium text-foreground">
                  {performance.minutes_played}'
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Date</div>
                <div className="font-medium text-foreground">
                  {new Date(performance.match_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {performance.goals}G + {performance.assists}A
                  </div>
                  <div className="text-xs text-muted-foreground">Goals + Assists</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {performance.shots_on_target}/{performance.shots_total}
                  </div>
                  <div className="text-xs text-muted-foreground">Shots On Target</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {performance.pass_accuracy > 0 ? `${performance.pass_accuracy.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Pass Accuracy</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {performance.distance_covered > 0 ? `${performance.distance_covered.toFixed(1)}km` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {performances.length === 10 && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              {/* TODO: Add translation */}
              Showing last 10 matches. More detailed analysis available in match reports.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
