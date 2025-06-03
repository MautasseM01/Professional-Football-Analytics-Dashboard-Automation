
import { Player } from "@/types";
import { HeatmapCard } from "./HeatmapCard";
import { TackleSuccessCard } from "./TackleSuccessCard";

interface PlayerHeatmapTackleSectionProps {
  player: Player;
}

export const PlayerHeatmapTackleSection = ({ player }: PlayerHeatmapTackleSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <HeatmapCard player={player} />
      </div>
      <div className="lg:col-span-1">
        <TackleSuccessCard player={player} />
      </div>
    </div>
  );
};
