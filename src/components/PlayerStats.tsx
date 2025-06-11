
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { ResponsiveLayout } from "./ResponsiveLayout";

interface PlayerStatsProps {
  player: Player;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  return (
    <ResponsiveLayout className="space-y-4 sm:space-y-6">
      {/* Player Profile */}
      <PlayerProfileCard player={player} />
      
      {/* Performance Statistics Cards */}
      <PlayerStatCards player={player} />
      
      {/* Performance Trends */}
      <PlayerPerformanceSection player={player} />
      
      {/* Heatmap and Tackle Success */}
      <PlayerHeatmapTackleSection player={player} />
    </ResponsiveLayout>
  );
};
