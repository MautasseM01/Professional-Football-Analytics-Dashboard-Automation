
import { Player } from "@/types";
import { Activity } from "lucide-react";
import { HeatmapCard } from "./HeatmapCard";

interface PlayerHeatmapSectionProps {
  player: Player;
}

export const PlayerHeatmapSection = ({ player }: PlayerHeatmapSectionProps) => {
  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="flex items-center gap-2 px-4 sm:px-0">
        <Activity className="w-5 h-5 text-club-gold flex-shrink-0" />
        <h2 className="heading-tertiary mb-0 text-club-light-gray">
          Player Heatmap Analysis
        </h2>
      </header>
      <div className="sm:px-0 px-0 py-0">
        <HeatmapCard player={player} />
      </div>
    </section>
  );
};
