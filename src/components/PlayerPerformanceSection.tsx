
import { Player } from "@/types";
import { EnhancedPerformanceChart } from "./PerformanceTrends/EnhancedPerformanceChart";
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
        <EnhancedPerformanceChart player={player} />
      </ResponsiveLayout>
    </ErrorBoundary>
  );
};
