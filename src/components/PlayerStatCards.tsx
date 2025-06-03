
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
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerStatCardsProps {
  player: Player;
}

export const PlayerStatCards = ({ player }: PlayerStatCardsProps) => {
  const isMobile = useIsMobile();
  
  const passCompletionRate = player.passes_attempted > 0
    ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
    : "0";

  const shotsAccuracy = player.shots_total > 0
    ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
    : "0";

  return (
    <TooltipProvider>
      <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
        isMobile 
          ? 'grid-cols-1 space-y-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      }`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm">Matches Played</span>
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={player.matches} 
                icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs text-xs sm:text-sm">
            <p>Total number of matches the player has participated in during the current season.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm">Distance Covered</span>
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={player.distance} 
                subValue="kilometers" 
                icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs text-xs sm:text-sm">
            <p>Total distance covered by the player during matches, measured in kilometers. Indicates player's mobility and endurance.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm">Pass Completion</span>
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={`${passCompletionRate}%`} 
                subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
                icon={<BarChart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs text-xs sm:text-sm">
            <p>Percentage of successful passes relative to total pass attempts. Higher percentage indicates better passing accuracy and decision-making.</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <StatCard 
                title={
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm">Shot Accuracy</span>
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-club-light-gray/60 flex-shrink-0" />
                  </div>
                } 
                value={`${shotsAccuracy}%`} 
                subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
                icon={<PieChart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs text-xs sm:text-sm">
            <p>Percentage of shots that were on target compared to total shots taken. Measures a player's shooting precision and efficiency.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full">
              <DisciplinaryCard playerId={player.id} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs text-xs sm:text-sm">
            <p>Player's disciplinary record including yellow and red cards. Risk levels: SAFE (0-3), AT RISK (4), CRITICAL (5+).</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
