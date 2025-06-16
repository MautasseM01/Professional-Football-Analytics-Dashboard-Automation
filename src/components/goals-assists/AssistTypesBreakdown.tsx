
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AssistTypesBreakdownProps {
  player: Player;
}

export const AssistTypesBreakdown = ({ player }: AssistTypesBreakdownProps) => {
  const { assists, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const assistTypeData = assists.reduce((acc, assist) => {
    const type = assist.assist_type || 'Pass';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const passTypeData = assists.reduce((acc, assist) => {
    const type = assist.pass_type || 'Short Pass';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgDifficulty = assists.length > 0 
    ? assists.reduce((sum, assist) => sum + (assist.difficulty_rating || 5), 0) / assists.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Assist Types Breakdown
          <Badge variant="secondary">{assists.length} assists</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assists.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No assists data available</p>
        ) : (
          <div className="space-y-6">
            {/* Assist Types */}
            <div>
              <h4 className="font-medium mb-3">Assist Types</h4>
              <div className="space-y-2">
                {Object.entries(assistTypeData).map(([type, count]) => {
                  const percentage = (count / assists.length) * 100;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pass Types */}
            <div>
              <h4 className="font-medium mb-3">Pass Types</h4>
              <div className="space-y-2">
                {Object.entries(passTypeData).map(([type, count]) => {
                  const percentage = (count / assists.length) * 100;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Average Difficulty */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Average Difficulty</span>
                <Badge variant={avgDifficulty >= 7 ? "default" : avgDifficulty >= 5 ? "secondary" : "outline"}>
                  {avgDifficulty.toFixed(1)}/10
                </Badge>
              </div>
              <Progress value={avgDifficulty * 10} className="h-2 mt-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
