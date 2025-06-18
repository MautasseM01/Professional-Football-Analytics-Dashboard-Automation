
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { format } from "date-fns";

interface GoalsTimelineProps {
  player: Player;
}

export const GoalsTimeline = ({ player }: GoalsTimelineProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Goals Timeline
          <Badge variant="secondary" className="bg-club-gold/20 dark:bg-club-gold/20 light:bg-yellow-100 text-club-gold dark:text-club-gold light:text-yellow-800 border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200">
            {goals.length} goals
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-club-gold/50 scrollbar-track-transparent">
          {goals.length === 0 ? (
            <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-center py-8">No goals scored yet</p>
          ) : (
            goals.map((goal, index) => (
              <div key={goal.id} className="flex items-start gap-4 p-4 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50 hover:bg-club-black/30 dark:hover:bg-club-black/30 light:hover:bg-gray-100/50 transition-colors duration-200">
                <div className="w-3 h-3 rounded-full bg-club-gold dark:bg-club-gold light:bg-yellow-500 mt-2 flex-shrink-0 shadow-sm" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-900">{goal.match_name}</h4>
                    <span className="text-sm text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                      {goal.match_date && format(new Date(goal.match_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                      {goal.minute}'
                    </Badge>
                    <Badge variant="outline" className="text-xs border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                      {goal.goal_type}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                      {goal.body_part}
                    </Badge>
                    {goal.assisted_by_name && (
                      <span className="text-sm text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                        Assisted by <span className="text-club-gold dark:text-club-gold light:text-yellow-600 font-medium">{goal.assisted_by_name}</span>
                      </span>
                    )}
                  </div>
                  {goal.distance_from_goal && (
                    <div className="text-sm text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                      Distance: <span className="text-club-gold dark:text-club-gold light:text-yellow-600 font-medium">{goal.distance_from_goal}m</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
