
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
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Assist Network
          <Badge variant="secondary" className="bg-club-gold/20 dark:bg-club-gold/20 light:bg-yellow-100 text-club-gold dark:text-club-gold light:text-yellow-800 border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200">
            {assistsProvided} assists given
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Assists Received */}
          <div>
            <h4 className="font-medium mb-3 text-club-light-gray dark:text-club-light-gray light:text-gray-900">Assists Received</h4>
            {Object.keys(assistsReceived).length === 0 ? (
              <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-sm">No assisted goals</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(assistsReceived)
                  .sort(([,a], [,b]) => b - a)
                  .map(([player, count]) => (
                    <div key={player} className="flex items-center justify-between p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                      <span className="text-sm font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-700">{player}</span>
                      <Badge variant="outline" className="border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200 text-club-gold dark:text-club-gold light:text-yellow-700">
                        {count} assists
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Assists Provided Summary */}
          <div>
            <h4 className="font-medium mb-3 text-club-light-gray dark:text-club-light-gray light:text-gray-900">Assists Provided</h4>
            {assistsProvided === 0 ? (
              <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-sm">No assists provided</p>
            ) : (
              <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-club-light-gray dark:text-club-light-gray light:text-gray-700">Total Assists</span>
                  <Badge className="bg-club-gold dark:bg-club-gold light:bg-yellow-500 text-club-black dark:text-club-black light:text-white">
                    {assistsProvided}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Network Stats */}
          <div className="pt-4 border-t border-club-gold/10 dark:border-club-gold/10 light:border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                <div className="text-2xl font-bold text-club-gold dark:text-club-gold light:text-green-600">{goals.filter(g => g.assisted_by_name).length}</div>
                <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Assisted Goals</div>
              </div>
              <div className="p-3 rounded-lg border border-club-gold/10 dark:border-club-gold/10 light:border-gray-100 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-50/50">
                <div className="text-2xl font-bold text-club-gold dark:text-club-gold light:text-blue-600">{goals.filter(g => !g.assisted_by_name).length}</div>
                <div className="text-xs text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">Solo Goals</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
