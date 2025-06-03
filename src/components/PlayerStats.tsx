
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint, useOrientation } from "@/hooks/use-orientation";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const orientation = useOrientation();
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center px-4 transition-all duration-300 ease-in-out">
        <div className="space-y-2">
          <p className="text-club-light-gray text-sm xs:text-base lg:text-lg transition-all duration-300 ease-in-out">
            No player selected
          </p>
          <p className="text-club-light-gray/60 text-xs xs:text-sm transition-all duration-300 ease-in-out">
            Please select a player to view their statistics
          </p>
        </div>
      </div>
    );
  }

  // Intelligent spacing based on breakpoint and orientation
  const getSpacing = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'space-y-2' : 'space-y-3';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'space-y-4';
    }
    if (breakpoint === 'tablet-landscape') {
      return 'space-y-4 sm:space-y-5';
    }
    return 'space-y-4 sm:space-y-6';
  };

  // Responsive padding
  const getPadding = () => {
    if (breakpoint === 'mobile') {
      return 'px-3';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'px-4';
    }
    return 'px-4 sm:px-6 lg:px-8';
  };

  return (
    <ResponsiveLayout className={`
      w-full max-w-7xl mx-auto 
      ${getSpacing()} 
      ${getPadding()}
      transition-all duration-300 ease-in-out
    `}>
      {/* Player Profile Card with intelligent layout */}
      <div className="transition-all duration-300 ease-in-out">
        <PlayerProfileCard player={player} />
      </div>

      {/* Stats Cards Grid with responsive transitions */}
      <div className="transition-all duration-300 ease-in-out">
        <PlayerStatCards player={player} />
      </div>

      {/* Performance Section - Intelligent mobile/desktop switching */}
      <div className="transition-all duration-300 ease-in-out">
        {isMobile || breakpoint === 'mobile' || breakpoint === 'tablet-portrait' ? (
          <MobilePerformanceTrends player={player} />
        ) : (
          <PlayerPerformanceSection player={player} />
        )}
      </div>

      {/* Heatmap and Tackle Success Cards with responsive layout */}
      <div className="transition-all duration-300 ease-in-out">
        <PlayerHeatmapTackleSection player={player} />
      </div>
    </ResponsiveLayout>
  );
};
