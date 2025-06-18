
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
    <Card className="bg-club-black/40 dark:bg-club-black/40 light:bg-white/90 border-club-gold/20 dark:border-club-gold/20 light:border-gray-200 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-club-gold dark:text-club-gold light:text-gray-900 text-lg font-semibold">
          Assist Types Breakdown
          <Badge variant="secondary" className="bg-club-gold/20 dark:bg-club-gold/20 light:bg-yellow-100 text-club-gold dark:text-club-gold light:text-yellow-800 border-club-gold/30 dark:border-club-gold/30 light:border-yellow-200">
            {assists.length} assists
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assists.length === 0 ? (
          <p className="text-club-light-gray/60 dark:text-club-light-gray/60 light:text-gray-500 text-center py-8">No assists data available</p>
        ) : (
          <div className="space-y-6">
            {/* Assist Types */}
            <div>
              <h4 className="font-medium mb-3 text-club-light-gray dark:text-club-light-gray light:text-gray-900">Assist Types</h4>
              <div className="space-y-3">
                {Object.entries(assistTypeData).map(([type, count]) => {
                  const percentage = (count / assists.length) * 100;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-700">{type}</span>
                        <span className="text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                          <span className="text-club-gold dark:text-club-gold light:text-gray-900 font-bold">{count}</span> ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-200" 
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pass Types */}
            <div>
              <h4 className="font-medium mb-3 text-club-light-gray dark:text-club-light-gray light:text-gray-900">Pass Types</h4>
              <div className="space-y-3">
                {Object.entries(passTypeData).map(([type, count]) => {
                  const percentage = (count / assists.length) * 100;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-700">{type}</span>
                        <span className="text-club-light-gray/70 dark:text-club-light-gray/70 light:text-gray-500">
                          <span className="text-club-gold dark:text-club-gold light:text-gray-900 font-bold">{count}</span> ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-200"
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Average Difficulty */}
            <div className="pt-4 border-t border-club-gold/10 dark:border-club-gold/10 light:border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-club-light-gray dark:text-club-light-gray light:text-gray-900">Average Difficulty</span>
                <Badge variant={avgDifficulty >= 7 ? "default" : avgDifficulty >= 5 ? "secondary" : "outline"} 
                       className={avgDifficulty >= 7 ? "bg-club-gold text-club-black" : "border-club-gold/30 text-club-gold"}>
                  {avgDifficulty.toFixed(1)}/10
                </Badge>
              </div>
              <Progress 
                value={avgDifficulty * 10} 
                className="h-3 bg-club-black/20 dark:bg-club-black/20 light:bg-gray-200"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)'
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
