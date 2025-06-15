
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { DisciplinaryCard } from "./DisciplinaryCard";
import { ResponsiveGrid } from "./ResponsiveLayout";
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
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { ErrorFallback } from "./ErrorStates/ErrorFallback";
import { useMemo } from "react";

interface PlayerStatCardsProps {
  player: Player;
}

export const PlayerStatCards = ({ player }: PlayerStatCardsProps) => {
  const breakpoint = useResponsiveBreakpoint();
  
  const { passCompletionRate, shotsAccuracy, gridConfig } = useMemo(() => {
    // Safely calculate pass completion rate
    const passCompletionRate = player?.passes_attempted && player.passes_attempted > 0
      ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
      : "0";

    // Safely calculate shots accuracy
    const shotsAccuracy = player?.shots_total && player.shots_total > 0
      ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
      : "0";

    // Intelligent grid configuration based on breakpoint
    const getGridConfig = () => {
      switch (breakpoint) {
        case 'mobile':
          return { minWidth: '100%', className: 'grid-cols-1' };
        case 'tablet-portrait':
          return { minWidth: '280px', className: 'grid-cols-1 xs:grid-cols-2' };
        case 'tablet-landscape':
          return { minWidth: '240px', className: 'grid-cols-2 md:grid-cols-3' };
        case 'desktop':
          return { minWidth: '220px', className: 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' };
        case 'large':
        default:
          return { minWidth: '200px', className: 'grid-cols-5' };
      }
    };

    return {
      passCompletionRate,
      shotsAccuracy,
      gridConfig: getGridConfig()
    };
  }, [player, breakpoint]);

  if (!player) {
    return (
      <ErrorFallback 
        title="No player data"
        description="Player statistics are not available"
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full transition-all duration-300 ease-in-out">
        <ResponsiveGrid 
          minCardWidth={gridConfig.minWidth}
          className={`
            ${gridConfig.className}
            auto-rows-fr
            gap-4 sm:gap-5 lg:gap-6
            transition-all duration-300 ease-in-out
          `}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0 transition-all duration-300 ease-in-out">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Matches Played</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.matches || 0} 
                  icon={<Calendar />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs sm:text-sm">
              <p>Total number of matches the player has participated in during the current season.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0 transition-all duration-300 ease-in-out">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Distance Covered</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.distance || 0} 
                  subValue="kilometers" 
                  icon={<Activity />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs sm:text-sm">
              <p>Total distance covered by the player during matches, measured in kilometers. Indicates player's mobility and endurance.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0 transition-all duration-300 ease-in-out">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Pass Completion</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={`${passCompletionRate}%`} 
                  subValue={`${player.passes_completed || 0}/${player.passes_attempted || 0} passes`} 
                  icon={<BarChart />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs sm:text-sm">
              <p>Percentage of successful passes relative to total pass attempts. Higher percentage indicates better passing accuracy and decision-making.</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0 transition-all duration-300 ease-in-out">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Shot Accuracy</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={`${shotsAccuracy}%`} 
                  subValue={`${player.shots_on_target || 0}/${player.shots_total || 0} shots`} 
                  icon={<PieChart />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs sm:text-sm">
              <p>Percentage of shots that were on target compared to total shots taken. Measures a player's shooting precision and efficiency.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`
                w-full h-full min-w-0 transition-all duration-300 ease-in-out
                ${breakpoint === 'tablet-portrait' ? 'col-span-2' : ''}
                ${breakpoint === 'tablet-landscape' ? 'col-span-1' : ''}
              `}>
                <DisciplinaryCard playerId={player.id} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs sm:text-sm">
              <p>Player's disciplinary record including yellow and red cards. Risk levels: SAFE (0-3), AT RISK (4), CRITICAL (5+).</p>
            </TooltipContent>
          </Tooltip>
        </ResponsiveGrid>
      </div>
    </TooltipProvider>
  );
};
