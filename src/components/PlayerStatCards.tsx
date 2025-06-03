
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { DisciplinaryCard } from "./DisciplinaryCard";
import { 
  BarChart, 
  PieChart, 
  Activity,
  Calendar,
  Info,
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface PlayerStatCardsProps {
  player: Player;
}

export const PlayerStatCards = ({ player }: PlayerStatCardsProps) => {
  const passCompletionRate = player.passes_attempted > 0
    ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
    : "0";

  const shotsAccuracy = player.shots_total > 0
    ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
    : "0";

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span>Matches Played</span>
                    <Info className="w-3.5 h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={player.matches} 
                icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
            <p>Total number of matches the player has participated in during the current season.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span>Distance Covered</span>
                    <Info className="w-3.5 h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={player.distance} 
                subValue="kilometers" 
                icon={<Activity className="w-5 h-5 sm:w-6 sm:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
            <p>Total distance covered by the player during matches, measured in kilometers. Indicates player's mobility and endurance.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span>Pass Completion</span>
                    <Info className="w-3.5 h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={`${passCompletionRate}%`} 
                subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
                icon={<BarChart className="w-5 h-5 sm:w-6 sm:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
            <p>Percentage of successful passes relative to total pass attempts. Higher percentage indicates better passing accuracy and decision-making.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span>Shot Accuracy</span>
                    <Info className="w-3.5 h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={`${shotsAccuracy}%`} 
                subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
                icon={<PieChart className="w-5 h-5 sm:w-6 sm:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
            <p>Percentage of shots that were on target compared to total shots taken. Measures a player's shooting precision and efficiency.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <DisciplinaryCard playerId={player.id} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
            <p>Player's disciplinary record including yellow and red cards. Risk levels: SAFE (0-3), AT RISK (4), CRITICAL (5+).</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
