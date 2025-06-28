
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { PlayerHeatmapSection } from "./PlayerHeatmapSection";
import { PlayerTackleSuccessSection } from "./PlayerTackleSuccessSection";
import { GoalsBreakdownCard } from "./GoalsBreakdownCard";
import { DetailedAttributesCard } from "./DetailedAttributesCard";
import { MatchByMatchCard } from "./MatchByMatchCard";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorFallback } from "./ErrorStates/ErrorFallback";
import { RoleBasedContent } from "./RoleBasedContent";

// Analyst-specific components
import { AnalystPlayerFilters } from "./analyst/AnalystPlayerFilters";
import { BenchmarkComparisonCard } from "./analyst/BenchmarkComparisonCard";
import { PredictiveAnalyticsCard } from "./analyst/PredictiveAnalyticsCard";
import { PlayerExportDialog } from "./analyst/PlayerExportDialog";

// Analyst-specific hooks
import { useAnalystPlayerData } from "@/hooks/use-analyst-player-data";

interface PlayerStatsProps {
  player: Player;
  analystMode?: boolean;
}

export const PlayerStats = ({ player, analystMode = false }: PlayerStatsProps) => {
  const {
    data: analystData,
    loading: analystLoading,
    error: analystError,
    timeFilter,
    setTimeFilter,
    matchTypeFilter,
    setMatchTypeFilter,
    refetch: refetchAnalystData
  } = useAnalystPlayerData(analystMode ? player : null);

  if (!player) {
    return (
      <ErrorFallback 
        title="No player data"
        description="Player information is not available"
      />
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          title="Player stats error"
          description="Failed to load player statistics"
        />
      }
    >
      <ResponsiveLayout className="space-y-4 sm:space-y-6">
        {/* Analyst-specific controls */}
        <RoleBasedContent allowedRoles={['analyst', 'admin', 'management', 'performance_director']}>
          {analystMode && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-club-gold">
                  Advanced Analytics Dashboard
                </h3>
                <PlayerExportDialog player={player} />
              </div>
              
              <AnalystPlayerFilters
                timeFilter={timeFilter}
                matchTypeFilter={matchTypeFilter}
                onTimeFilterChange={setTimeFilter}
                onMatchTypeFilterChange={setMatchTypeFilter}
                onRefresh={refetchAnalystData}
                loading={analystLoading}
              />
            </div>
          )}
        </RoleBasedContent>

        {/* Player Profile */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Profile error"
              description="Failed to load player profile"
            />
          }
        >
          <PlayerProfileCard player={player} />
        </ErrorBoundary>
        
        {/* Performance Statistics Cards */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Statistics error"
              description="Failed to load performance statistics"
            />
          }
        >
          <PlayerStatCards player={player} />
        </ErrorBoundary>

        {/* Analyst-specific advanced analytics */}
        <RoleBasedContent allowedRoles={['analyst', 'admin', 'management', 'performance_director']}>
          {analystMode && analystData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ErrorBoundary
                fallback={
                  <ErrorFallback 
                    title="Benchmark error"
                    description="Failed to load benchmark comparisons"
                  />
                }
              >
                <BenchmarkComparisonCard benchmarks={analystData.benchmarkComparisons} />
              </ErrorBoundary>

              <ErrorBoundary
                fallback={
                  <ErrorFallback 
                    title="Predictive analytics error"
                    description="Failed to load predictive analytics"
                  />
                }
              >
                <PredictiveAnalyticsCard metrics={analystData.predictiveMetrics} />
              </ErrorBoundary>
            </div>
          )}
        </RoleBasedContent>
        
        {/* Performance Trends */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Performance trends error"
              description="Failed to load performance trends"
            />
          }
        >
          <PlayerPerformanceSection player={player} />
        </ErrorBoundary>

        {/* Goals & Assists Breakdown */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Goals breakdown error"
              description="Failed to load goals breakdown"
            />
          }
        >
          <GoalsBreakdownCard player={player} />
        </ErrorBoundary>

        {/* Detailed Player Attributes */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Attributes error"
              description="Failed to load player attributes"
            />
          }
        >
          <DetailedAttributesCard player={player} />
        </ErrorBoundary>

        {/* Match by Match Performance */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Match performance error"
              description="Failed to load match performances"
            />
          }
        >
          <MatchByMatchCard player={player} />
        </ErrorBoundary>
        
        {/* Player Heatmap Analysis */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Heatmap error"
              description="Failed to load heatmap analysis"
            />
          }
        >
          <PlayerHeatmapSection player={player} />
        </ErrorBoundary>
        
        {/* Tackle Success */}
        <ErrorBoundary
          fallback={
            <ErrorFallback 
              title="Tackle success error"
              description="Failed to load tackle success data"
            />
          }
        >
          <PlayerTackleSuccessSection player={player} />
        </ErrorBoundary>
      </ResponsiveLayout>
    </ErrorBoundary>
  );
};
