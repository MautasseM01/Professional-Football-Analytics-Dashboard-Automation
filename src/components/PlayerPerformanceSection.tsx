
import { Player } from "@/types";
import { LineChart } from "lucide-react";
import { PerformanceTrendsCard } from "./PerformanceTrendsCard";

interface PlayerPerformanceSectionProps {
  player: Player;
}

export const PlayerPerformanceSection = ({ player }: PlayerPerformanceSectionProps) => {
  return (
    <section className="space-y-4">
      <header className="flex items-center gap-2">
        <LineChart className="w-5 h-5 text-club-gold flex-shrink-0" />
        <h2 className="heading-tertiary mb-0">
          Performance Trends
        </h2>
      </header>
      <PerformanceTrendsCard player={player} />
    </section>
  );
};
