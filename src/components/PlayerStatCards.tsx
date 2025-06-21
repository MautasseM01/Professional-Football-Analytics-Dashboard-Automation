
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { EnhancedDisciplinaryCard } from "./EnhancedDisciplinaryCard";
import { 
  BarChart, 
  PieChart, 
  Activity,
  Calendar,
  Info,
  Target,
  Trophy,
  Zap,
  Star
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ErrorFallback } from "./ErrorStates/ErrorFallback";
import { useMemo } from "react";

interface PlayerStatCardsProps {
  player: Player;
}

export const PlayerStatCards = ({ player }: PlayerStatCardsProps) => {
  const { passCompletionRate, shotsAccuracy, goalsPlusAssists } = useMemo(() => {
    // Safely calculate pass completion rate
    const passCompletionRate = player?.passes_attempted && player.passes_attempted > 0
      ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
      : "0";

    // Safely calculate shots accuracy
    const shotsAccuracy = player?.shots_total && player.shots_total > 0
      ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
      : "0";

    // Calculate goals + assists with safe fallbacks
    const goalsPlusAssists = (player?.goals || 0) + (player?.assists || 0);

    return {
      passCompletionRate,
      shotsAccuracy,
      goalsPlusAssists
    };
  }, [player]);

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
      <div className="w-full space-y-6">
        {/* Main Stats Grid - Compact 5-card layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 auto-rows-fr">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Matches</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.matches || 0} 
                  icon={<Calendar />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Total matches played this season</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Goals</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.goals || 0} 
                  subValue={`${((player.goals || 0) / Math.max(player.matches || 1, 1)).toFixed(2)} per match`}
                  icon={<Target />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Total goals scored and average per match</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Assists</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.assists || 0} 
                  subValue={`${((player.assists || 0) / Math.max(player.matches || 1, 1)).toFixed(2)} per match`}
                  icon={<Zap />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Total assists provided and average per match</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>G+A</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={goalsPlusAssists} 
                  subValue={`${(goalsPlusAssists / Math.max(player.matches || 1, 1)).toFixed(2)} per match`}
                  icon={<Trophy />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Total goal contributions (Goals + Assists)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Rating</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.match_rating ? Number(player.match_rating).toFixed(1) : "0.0"} 
                  subValue="Average"
                  icon={<Star />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Average match rating across all games</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Secondary Stats Grid - Additional metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Distance</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={player.distance ? Number(player.distance).toFixed(1) : "0"} 
                  subValue="km total" 
                  icon={<Activity />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Total distance covered in all matches</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Pass Accuracy</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={`${passCompletionRate}%`} 
                  subValue={`${player.passes_completed || 0}/${player.passes_attempted || 0}`} 
                  icon={<BarChart />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Pass completion percentage and total attempts</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full min-w-0">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1.5">
                      <span>Shot Accuracy</span>
                      <Info className="w-3 h-3 text-club-light-gray/60 light:text-gray-500 flex-shrink-0" />
                    </div>
                  } 
                  value={`${shotsAccuracy}%`} 
                  subValue={`${player.shots_on_target || 0}/${player.shots_total || 0}`} 
                  icon={<PieChart />} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray light:bg-white border-club-gold/30 light:border-gray-200 text-club-light-gray light:text-gray-900 max-w-xs text-xs">
              <p>Shot accuracy percentage and total attempts</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Enhanced Disciplinary Card - Properly separated */}
        <div className="mt-6">
          <EnhancedDisciplinaryCard playerId={player.id} />
        </div>
      </div>
    </TooltipProvider>
  );
};
