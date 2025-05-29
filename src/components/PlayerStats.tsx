
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { 
  BarChart, 
  PieChart, 
  Activity,
  Calendar,
  Info,
  LineChart,
} from "lucide-react";
import { HeatmapCard } from "./HeatmapCard";
import { TackleSuccessCard } from "./TackleSuccessCard";
import { DisciplinaryCard } from "./DisciplinaryCard";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState } from "react";
import { PerformanceTrendsCard } from "./PerformanceTrendsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGoogleDriveThumbnailUrl } from "@/lib/image-utils";

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

  // Generate player avatar initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Player Profile Card */}
        <Card className="bg-club-black/50 border-club-gold/20 w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              <div className="flex-shrink-0">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border-2 border-club-gold/30">
                  {player.heatmapUrl ? (
                    <AvatarImage 
                      src={getGoogleDriveThumbnailUrl(player.heatmapUrl) || player.heatmapUrl} 
                      alt={player.name} 
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-xl sm:text-2xl bg-club-gold/20 text-club-gold">
                      {getInitials(player.name || "Player Name")}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-club-gold">{player.name}</h2>
                <div className="flex flex-col sm:flex-row sm:gap-4 lg:gap-6 mt-2 space-y-1 sm:space-y-0">
                  <p className="text-club-light-gray/80 text-sm sm:text-base">
                    <span className="font-medium text-club-light-gray">Position:</span> {player.position}
                  </p>
                  <p className="text-club-light-gray/80 text-sm sm:text-base">
                    <span className="font-medium text-club-light-gray">Matches:</span> {player.matches}
                  </p>
                  <p className="text-club-light-gray/80 text-sm sm:text-base">
                    <span className="font-medium text-club-light-gray">Max Speed:</span> {player.maxSpeed?.toFixed(1) || "N/A"} km/h
                  </p>
                </div>
                
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-2 py-1 bg-club-gold/20 text-club-gold text-xs rounded-full">
                    Season 2023-24
                  </span>
                  {player.position && (
                    <span className="px-2 py-1 bg-club-dark-bg text-club-light-gray text-xs rounded-full">
                      {player.position}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Matches Played
                      <Info className="w-3.5 h-3.5 text-club-light-gray/60" />
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
              <div className="w-full">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Distance Covered
                      <Info className="w-3.5 h-3.5 text-club-light-gray/60" />
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
              <div className="w-full">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Pass Completion
                      <Info className="w-3.5 h-3.5 text-club-light-gray/60" />
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
              <div className="w-full">
                <StatCard 
                  title={
                    <div className="flex items-center gap-1">
                      Shot Accuracy
                      <Info className="w-3.5 h-3.5 text-club-light-gray/60" />
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
              <div className="w-full">
                <DisciplinaryCard playerId={player.id} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray max-w-xs">
              <p>Player's disciplinary record including yellow and red cards. Risk levels: SAFE (0-3), AT RISK (4), CRITICAL (5+).</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Heatmap and Tackle Success Cards - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <HeatmapCard player={player} />
          </div>
          <div className="lg:col-span-1">
            <TackleSuccessCard player={player} />
          </div>
        </div>
        
        {/* Performance Trends Section */}
        <div className="mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-club-gold flex items-center gap-2">
            <LineChart className="w-4 h-4 sm:w-5 sm:h-5" />
            Performance Trends
          </h2>
          <PerformanceTrendsCard player={player} />
        </div>
      </div>
    </TooltipProvider>
  );
};
