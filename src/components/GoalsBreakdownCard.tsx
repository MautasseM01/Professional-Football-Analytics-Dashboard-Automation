
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { useGoalsData } from "@/hooks/use-goals-data";
import { Target, Zap, Clock, MapPin, Loader } from "lucide-react";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface GoalsBreakdownCardProps {
  player: Player;
}

export const GoalsBreakdownCard = ({ player }: GoalsBreakdownCardProps) => {
  const { goals, assists, loading, error } = useGoalsData(player);
  const { theme } = useTheme();

  if (loading) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Target className="w-5 h-5" />
            Goals & Assists Breakdown
          </CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Detailed analysis of scoring and assist patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-club-gold animate-spin" />
            <p className="text-sm text-club-light-gray">Loading goals and assists data...</p>
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
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <Target className="w-5 h-5" />
            Goals & Assists Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ErrorFallback 
            title="Goals data error"
            description={`Failed to load goals data: ${error}`}
          />
        </CardContent>
      </Card>
    );
  }

  // Calculate breakdowns
  const goalsByType = goals.reduce((acc, goal) => {
    acc[goal.goal_type] = (acc[goal.goal_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goalsByBodyPart = goals.reduce((acc, goal) => {
    acc[goal.body_part] = (acc[goal.body_part] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assistsByType = assists.reduce((acc, assist) => {
    acc[assist.assist_type] = (acc[assist.assist_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueAssisters = [...new Set(goals.filter(g => g.assisted_by_name).map(g => g.assisted_by_name))];

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-club-gold">
          <Target className="w-5 h-5" />
          Goals & Assists Breakdown
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 light:text-gray-600">
          Detailed analysis of scoring and assist patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Goals ({goals.length})
          </h3>
          
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Goals by Type */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-club-light-gray/80 light:text-gray-700">By Type</h4>
                <div className="space-y-1">
                  {Object.entries(goalsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-club-black/20 light:bg-gray-100 rounded">
                      <span className="text-sm text-club-light-gray light:text-gray-800">{type}</span>
                      <span className="text-sm font-semibold text-club-gold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals by Body Part */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-club-light-gray/80 light:text-gray-700">By Body Part</h4>
                <div className="space-y-1">
                  {Object.entries(goalsByBodyPart).map(([part, count]) => (
                    <div key={part} className="flex justify-between items-center p-2 bg-club-black/20 light:bg-gray-100 rounded">
                      <span className="text-sm text-club-light-gray light:text-gray-800">{part}</span>
                      <span className="text-sm font-semibold text-club-gold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-club-black/10 light:bg-gray-50 rounded-lg">
              <Target className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400 mb-2" />
              <p className="text-sm text-club-light-gray/60 light:text-gray-500">No goals recorded yet</p>
            </div>
          )}
        </div>

        {/* Assists Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Assists ({assists.length})
          </h3>
          
          {assists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assists by Type */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-club-light-gray/80 light:text-gray-700">By Type</h4>
                <div className="space-y-1">
                  {Object.entries(assistsByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-club-black/20 light:bg-gray-100 rounded">
                      <span className="text-sm text-club-light-gray light:text-gray-800">{type}</span>
                      <span className="text-sm font-semibold text-club-gold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Assists */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-club-light-gray/80 light:text-gray-700">Recent Assists</h4>
                <div className="space-y-1">
                  {assists.slice(0, 4).map((assist) => (
                    <div key={assist.id} className="flex justify-between items-center p-2 bg-club-black/20 light:bg-gray-100 rounded">
                      <span className="text-sm text-club-light-gray light:text-gray-800">{assist.match_name}</span>
                      <span className="text-xs text-club-light-gray/60 light:text-gray-500">
                        {new Date(assist.match_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-club-black/10 light:bg-gray-50 rounded-lg">
              <Zap className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400 mb-2" />
              <p className="text-sm text-club-light-gray/60 light:text-gray-500">No assists recorded yet</p>
            </div>
          )}
        </div>

        {/* Assist Providers - Only show if there are goals with assists */}
        {uniqueAssisters.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-club-light-gray light:text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Top Assist Providers
            </h3>
            <div className="flex flex-wrap gap-2">
              {uniqueAssisters.slice(0, 5).map((assister) => (
                <span 
                  key={assister} 
                  className="px-3 py-1 bg-club-gold/20 text-club-gold text-sm rounded-full"
                >
                  {assister}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
