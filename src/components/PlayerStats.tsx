
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center">
        <div className="space-y-2">
          <p className="text-lg text-club-light-gray">No player selected</p>
          <p className="text-sm text-club-light-gray/60">Please select a player to view their statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Player Profile Card */}
      <PlayerProfileCard player={player} />

      {/* Stats Cards Grid */}
      <PlayerStatCards player={player} />

      {/* Heatmap and Tackle Success Cards */}
      <PlayerHeatmapTackleSection player={player} />
      
      {/* Performance Trends Section */}
      <PlayerPerformanceSection player={player} />
    </div>
  );
};
