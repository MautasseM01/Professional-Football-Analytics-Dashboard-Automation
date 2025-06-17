
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Calendar, Trophy, Target, Zap, Activity, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MatchByMatchCardProps {
  player: Player;
}

export const MatchByMatchCard = ({ player }: MatchByMatchCardProps) => {
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 10);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!performances || performances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No match performance data available</p>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "text-green-500";
    if (rating >= 7.5) return "text-blue-500";
    if (rating >= 6.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 8.5) return "default";
    if (rating >= 7.5) return "secondary";
    if (rating >= 6.5) return "outline";
    return "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Match-by-Match Performance
          <Badge variant="outline">{performances.length} matches</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performances.map((perf, index) => (
            <div key={perf.id} className="border rounded-lg p-4 space-y-3">
              {/* Match Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{perf.opponent}</span>
                  <Badge variant="outline">{perf.match_result}</Badge>
                  <Badge variant="outline">{perf.competition}</Badge>
                  {perf.player_of_match && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      MOTM
                    </Badge>
                  )}
                  {perf.captain && (
                    <Badge variant="secondary">Captain</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getRatingColor(perf.match_rating)}`}>
                    {perf.match_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(perf.match_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Performance Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="h-3 w-3" />
                    Goals & Assists
                  </div>
                  <div className="text-lg font-semibold">
                    {perf.goals}G + {perf.assists}A
                  </div>
                  {perf.shots_total > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {perf.shots_on_target}/{perf.shots_total} shots on target
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Passing
                  </div>
                  <div className="text-lg font-semibold">
                    {perf.pass_accuracy.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {perf.passes_completed}/{perf.passes_attempted} completed
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    Defending
                  </div>
                  <div className="text-lg font-semibold">
                    {perf.tackles_won}/{perf.tackles_attempted}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {perf.interceptions} interceptions
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    Physical
                  </div>
                  <div className="text-lg font-semibold">
                    {perf.distance_covered.toFixed(1)}km
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {perf.max_speed.toFixed(1)} km/h max
                  </div>
                </div>
              </div>

              {/* Performance Rating Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Match Rating</span>
                  <span className={`font-medium ${getRatingColor(perf.match_rating)}`}>
                    {perf.match_rating.toFixed(1)}/10
                  </span>
                </div>
                <Progress value={perf.match_rating * 10} className="h-2" />
              </div>

              {/* Additional Stats */}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{perf.minutes_played} minutes</span>
                <span>{perf.touches} touches</span>
                {perf.dribbles_attempted > 0 && (
                  <span>{perf.dribbles_successful}/{perf.dribbles_attempted} dribbles</span>
                )}
                {perf.aerial_duels_attempted > 0 && (
                  <span>{perf.aerial_duels_won}/{perf.aerial_duels_attempted} aerials</span>
                )}
                {perf.yellow_cards > 0 && (
                  <Badge variant="outline" className="text-yellow-600">
                    {perf.yellow_cards} Yellow
                  </Badge>
                )}
                {perf.red_cards > 0 && (
                  <Badge variant="destructive">
                    {perf.red_cards} Red
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
