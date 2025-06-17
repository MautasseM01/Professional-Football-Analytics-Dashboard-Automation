
import { Player } from "@/types";
import { PerformanceTrendsCard } from "./PerformanceTrends/PerformanceTrendsCard";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorFallback } from "./ErrorStates/ErrorFallback";

interface PlayerPerformanceSectionProps {
  player: Player;
}

export const PlayerPerformanceSection = ({ player }: PlayerPerformanceSectionProps) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback 
          title="Performance trends error"
          description="Failed to load performance trends"
        />
      }
    >
      <ResponsiveLayout className="space-y-4 sm:space-y-6">
        <PerformanceTrendsCard player={player} />
      </ResponsiveLayout>
    </ErrorBoundary>
  );
};
