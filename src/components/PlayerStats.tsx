
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { 
  BarChart, 
  PieChart, 
  Activity,
  Calendar,
  Info,
} from "lucide-react";
import { HeatmapCard } from "./HeatmapCard";
import { TackleSuccessCard } from "./TackleSuccessCard";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Matches Played
                      <Info size={14} className="text-club-light-gray/60" />
                    </div>
                  } 
                  value={player.matches} 
                  icon={<Calendar size={24} />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              <p>Total number of matches the player has participated in during the current season.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Distance Covered
                      <Info size={14} className="text-club-light-gray/60" />
                    </div>
                  } 
                  value={player.distance} 
                  subValue="kilometers" 
                  icon={<Activity size={24} />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              <p>Total distance covered by the player during matches, measured in kilometers. Indicates player's mobility and endurance.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Pass Completion
                      <Info size={14} className="text-club-light-gray/60" />
                    </div>
                  } 
                  value={`${passCompletionRate}%`} 
                  subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
                  icon={<BarChart size={24} />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              <p>Percentage of successful passes relative to total pass attempts. Higher percentage indicates better passing accuracy and decision-making.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Shot Accuracy
                      <Info size={14} className="text-club-light-gray/60" />
                    </div>
                  } 
                  value={`${shotsAccuracy}%`} 
                  subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
                  icon={<PieChart size={24} />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              <p>Percentage of shots that were on target compared to total shots taken. Measures a player's shooting precision and efficiency.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HeatmapCard player={player} />
          <TackleSuccessCard player={player} />
        </div>
      </div>
    </TooltipProvider>
  );
};
