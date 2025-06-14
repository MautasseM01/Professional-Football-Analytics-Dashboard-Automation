import { Player } from "@/types";
import { LineChart } from "lucide-react";
import { PerformanceTrendsCard } from "./PerformanceTrends";
interface PlayerPerformanceSectionProps {
  player: Player;
}
export const PlayerPerformanceSection = ({
  player
}: PlayerPerformanceSectionProps) => {
  return <section className="space-y-4 sm:space-y-6">
      <header className="flex items-center gap-2 px-4 sm:px-0">
        <LineChart className="w-5 h-5 text-club-gold flex-shrink-0" />
        <h2 className="heading-tertiary mb-0 text-club-light-gray">
          Performance Trends
        </h2>
      </header>
      <div className="sm:px-0 px-0 py-0">
        <PerformanceTrendsCard player={player} />
      </div>
    </section>;
};