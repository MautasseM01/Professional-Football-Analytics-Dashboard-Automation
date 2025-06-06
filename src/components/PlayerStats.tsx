
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center px-2 sm:px-4">
        <div className="space-y-2 sm:space-y-3">
          <p className={`text-club-light-gray ${isMobile ? 'text-base' : 'text-base sm:text-lg lg:text-xl'}`}>
            No player selected
          </p>
          <p className={`text-club-light-gray/60 ${isMobile ? 'text-sm' : 'text-sm'}`}>
            Please select a player to view their statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveLayout className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-0' : 'px-3 sm:px-4 lg:px-6'}`}>
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Player Profile Card */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerProfileCard player={player} />
        </div>

        {/* Stats Cards Grid */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerStatCards player={player} />
        </div>

        {/* Performance Section */}
        <div className="transition-all duration-300 ease-in-out">
          {isMobile ? (
            <MobilePerformanceTrends player={player} />
          ) : (
            <PlayerPerformanceSection player={player} />
          )}
        </div>

        {/* Heatmap and Tackle Success Cards */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerHeatmapTackleSection player={player} />
        </div>
      </div>
    </ResponsiveLayout>
  );
};
