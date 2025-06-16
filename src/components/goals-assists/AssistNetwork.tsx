
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Badge } from "@/components/ui/badge";

interface AssistNetworkProps {
  player: Player;
}

export const AssistNetwork = ({ player }: AssistNetworkProps) => {
  const { goals, assists, loading, error } = useGoalsData(player);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Count assists received (goals assisted by others)
  const assistsReceived = goals.filter(goal => goal.assisted_by_name).reduce((acc, goal) => {
    const assistProvider = goal.assisted_by_name!;
    acc[assistProvider] = (acc[assistProvider] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count assists provided (from assists data)
  const assistsProvided = assists.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Assist Network
          <Badge variant="secondary">{assistsProvided} assists given</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Assists Received */}
          <div>
            <h4 className="font-medium mb-3">Assists Received</h4>
            {Object.keys(assistsReceived).length === 0 ? (
              <p className="text-muted-foreground text-sm">No assisted goals</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(assistsReceived)
                  .sort(([,a], [,b]) => b - a)
                  .map(([player, count]) => (
                    <div key={player} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm font-medium">{player}</span>
                      <Badge variant="outline">{count} assists</Badge>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Assists Provided Summary */}
          <div>
            <h4 className="font-medium mb-3">Assists Provided</h4>
            {assistsProvided === 0 ? (
              <p className="text-muted-foreground text-sm">No assists provided</p>
            ) : (
              <div className="p-3 rounded border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Assists</span>
                  <Badge variant="default">{assistsProvided}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Network Stats */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{goals.filter(g => g.assisted_by_name).length}</div>
                <div className="text-xs text-muted-foreground">Assisted Goals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{goals.filter(g => !g.assisted_by_name).length}</div>
                <div className="text-xs text-muted-foreground">Solo Goals</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
