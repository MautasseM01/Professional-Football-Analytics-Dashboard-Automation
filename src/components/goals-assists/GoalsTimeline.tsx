
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { LoadingStates } from "@/components/LoadingStates";
import { format } from "date-fns";

interface GoalsTimelineProps {
  player: Player;
}

export const GoalsTimeline = ({ player }: GoalsTimelineProps) => {
  const { goals, loading, error } = useGoalsData(player);

  if (loading) return <LoadingStates.Card />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Goals Timeline
          <Badge variant="secondary">{goals.length} goals</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {goals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No goals scored yet</p>
          ) : (
            goals.map((goal, index) => (
              <div key={goal.id} className="flex items-start gap-4 p-3 rounded-lg border bg-muted/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{goal.match_name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {goal.match_date && format(new Date(goal.match_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {goal.minute}'
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {goal.goal_type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {goal.body_part}
                    </Badge>
                    {goal.assisted_by_name && (
                      <span className="text-muted-foreground">
                        Assisted by {goal.assisted_by_name}
                      </span>
                    )}
                  </div>
                  {goal.distance_from_goal && (
                    <div className="text-sm text-muted-foreground">
                      Distance: {goal.distance_from_goal}m
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
