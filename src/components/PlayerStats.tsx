
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { 
  BarChart, 
  PieChart, 
  Activity,
  Calendar,
} from "lucide-react";
import { HeatmapCard } from "./HeatmapCard";
import { TackleSuccessCard } from "./TackleSuccessCard";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return <div className="text-center py-8">No player selected</div>;
  }

  const passCompletionRate = player.passes_attempted > 0
    ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
    : "0";

  const shotsAccuracy = player.shots_total > 0
    ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Matches Played" 
          value={player.matches} 
          icon={<Calendar size={24} />} 
        />
        <StatCard 
          title="Distance Covered" 
          value={player.distance} 
          subValue="kilometers" 
          icon={<Activity size={24} />} 
        />
        <StatCard 
          title="Pass Completion" 
          value={`${passCompletionRate}%`} 
          subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
          icon={<BarChart size={24} />} 
        />
        <StatCard 
          title="Shot Accuracy" 
          value={`${shotsAccuracy}%`} 
          subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
          icon={<PieChart size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HeatmapCard player={player} />
        <TackleSuccessCard player={player} />
      </div>
    </div>
  );
};
