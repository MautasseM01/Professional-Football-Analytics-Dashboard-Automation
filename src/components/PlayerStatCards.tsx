
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { DisciplinaryCard } from "./DisciplinaryCard";
import { ResponsiveGrid } from "./ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerStatCardsProps {
  player: Player;
}

export const PlayerStatCards = ({ player }: PlayerStatCardsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveGrid 
      minCardWidth="200px" 
      className="auto-rows-fr gap-4 sm:gap-5 lg:gap-6"
      forceGrid={isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))"}
    >
      <StatCard
        title="Matches Played"
        value={player.matches?.toString() || "0"}
        icon="calendar"
      />
      
      <StatCard
        title="Distance Covered"
        value={`${player.distance?.toFixed(1) || "0"}`}
        unit="kilometers"
        icon="activity"
      />
      
      <StatCard
        title="Pass Completion"
        value={
          player.passes_attempted && player.passes_attempted > 0
            ? `${((player.passes_completed || 0) / player.passes_attempted * 100).toFixed(1)}%`
            : "0%"
        }
        subtitle={`${player.passes_completed || 0}/${player.passes_attempted || 0} passes`}
        icon="target"
      />
      
      <StatCard
        title="Shot Accuracy"
        value={
          player.shots_total && player.shots_total > 0
            ? `${((player.shots_on_target || 0) / player.shots_total * 100).toFixed(1)}%`
            : "0%"
        }
        subtitle={`${player.shots_on_target || 0}/${player.shots_total || 0} shots`}
        icon="clock"
      />

      {/* Disciplinary Record Card */}
      <DisciplinaryCard playerId={player.id} />
    </ResponsiveGrid>
  );
};
