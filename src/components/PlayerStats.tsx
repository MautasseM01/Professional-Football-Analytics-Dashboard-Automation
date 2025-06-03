
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
        <div className="space-y-2">
          <p className={`text-club-light-gray ${isMobile ? 'text-base' : 'text-lg'}`}>
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
    <div className={`w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 ${
      isMobile ? 'px-0' : 'px-4 sm:px-6 lg:px-8'
    }`}>
      {/* Player Profile Card */}
      <PlayerProfileCard player={player} />

      {/* Stats Cards Grid */}
      <PlayerStatCards player={player} />

      {/* Performance Section - Mobile vs Desktop */}
      {isMobile ? (
        <MobilePerformanceTrends player={player} />
      ) : (
        <PlayerPerformanceSection player={player} />
      )}

      {/* Heatmap and Tackle Success Cards */}
      <PlayerHeatmapTackleSection player={player} />
    </div>
  );
};
