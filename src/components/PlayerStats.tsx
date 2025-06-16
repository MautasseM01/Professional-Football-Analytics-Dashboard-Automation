
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

interface PlayerStatsProps {
  player: Player;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
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
