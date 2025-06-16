
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchRating } from "@/hooks/use-match-ratings";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { Trophy, Target, Shield, Users, Zap, Brain } from "lucide-react";

interface MatchRatingsDashboardProps {
  ratings: MatchRating[];
}

export const MatchRatingsDashboard = ({ ratings }: MatchRatingsDashboardProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No match ratings data available</p>
        </CardContent>
      </Card>
    );
  }

  const avgRatings = {
    overall: ratings.reduce((sum, r) => sum + r.overall_performance, 0) / ratings.length,
    attacking: ratings.reduce((sum, r) => sum + r.attacking_rating, 0) / ratings.length,
    defensive: ratings.reduce((sum, r) => sum + r.defensive_rating, 0) / ratings.length,
    possession: ratings.reduce((sum, r) => sum + r.possession_rating, 0) / ratings.length,
    tactical: ratings.reduce((sum, r) => sum + r.tactical_execution, 0) / ratings.length,
    mental: ratings.reduce((sum, r) => sum + r.mental_strength, 0) / ratings.length,
  };

  const recentMatches = ratings.slice(0, 5);
  
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500";
    if (rating >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 8) return "default";
    if (rating >= 6) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Average Ratings Overview */}
      <ResponsiveGrid minCardWidth="200px">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.overall.toFixed(1)}</div>
            <Progress value={avgRatings.overall * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Attacking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.attacking.toFixed(1)}</div>
            <Progress value={avgRatings.attacking * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Defensive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.defensive.toFixed(1)}</div>
            <Progress value={avgRatings.defensive * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Possession
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.possession.toFixed(1)}</div>
            <Progress value={avgRatings.possession * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4" />
              Tactical Execution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.tactical.toFixed(1)}</div>
            <Progress value={avgRatings.tactical * 10} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4" />
              Mental Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{avgRatings.mental.toFixed(1)}</div>
            <Progress value={avgRatings.mental * 10} className="h-2" />
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Match Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMatches.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{rating.opponent}</span>
                    <Badge variant="outline">{rating.result}</Badge>
                    {rating.man_of_match_name && (
                      <Badge variant="secondary" className="text-xs">
                        MOTM: {rating.man_of_match_name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(rating.match_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRatingColor(rating.overall_performance)}`}>
                      {rating.overall_performance.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Overall</div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={getRatingBadgeVariant(rating.attacking_rating)} className="text-xs">
                      A: {rating.attacking_rating.toFixed(1)}
                    </Badge>
                    <Badge variant={getRatingBadgeVariant(rating.defensive_rating)} className="text-xs">
                      D: {rating.defensive_rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
