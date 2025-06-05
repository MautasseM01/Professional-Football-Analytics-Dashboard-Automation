
import { Player } from "@/types";
import { HeatmapCard } from "./HeatmapCard";
import { TackleSuccessCard } from "./TackleSuccessCard";
import { ResponsiveGrid } from "./ResponsiveLayout";

interface PlayerHeatmapTackleSectionProps {
  player: Player;
}

export const PlayerHeatmapTackleSection = ({ player }: PlayerHeatmapTackleSectionProps) => {
  return (
    <ResponsiveGrid 
      minCardWidth="280px"
      className="grid-cols-1 lg:grid-cols-3 auto-rows-fr gap-4 sm:gap-5 lg:gap-6"
    >
      <div className="lg:col-span-2">
        <HeatmapCard player={player} />
      </div>
      <div className="lg:col-span-1">
        <TackleSuccessCard player={player} />
      </div>
    </ResponsiveGrid>
  );
};
