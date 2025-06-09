
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerAvatar } from "./PlayerAvatar";
import { ResponsiveStack } from "./ResponsiveLayout";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  return (
    <Card className="bg-white/95 dark:bg-club-black/50 backdrop-blur-md border border-white/30 dark:border-club-gold/10 shadow-lg shadow-black/5 dark:shadow-black/20 w-full max-w-full overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <ResponsiveStack 
          direction="auto"
          className="items-center sm:items-start gap-4 md:gap-6"
        >
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
            <PlayerAvatar 
              player={player}
              size="lg"
              className="ring-2 ring-blue-500/50 dark:ring-club-gold/50 h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-all duration-300 ease-in-out"
            />
          </div>
          
          <div className="text-center sm:text-left flex-1 min-w-0 w-full space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-club-gold break-words leading-tight">
              {player.name}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-club-light-gray">Position:</span>
                <span className="text-sm font-medium text-gray-600 dark:text-club-light-gray/80 break-words">{player.position}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-club-light-gray">Matches:</span>
                <span className="text-sm font-medium text-gray-600 dark:text-club-light-gray/80">{player.matches}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 col-span-1 sm:col-span-2 lg:col-span-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-club-light-gray">Max Speed:</span>
                <span className="text-sm font-medium text-gray-600 dark:text-club-light-gray/80">{player.maxSpeed?.toFixed(1) || "N/A"} km/h</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1.5 bg-blue-100 dark:bg-club-gold/20 text-blue-700 dark:text-club-gold text-sm font-semibold rounded-full">
                Season 2023-24
              </span>
              {player.position && (
                <span className="px-3 py-1.5 bg-gray-100 dark:bg-club-dark-bg text-gray-700 dark:text-club-light-gray text-sm font-semibold rounded-full">
                  {player.position}
                </span>
              )}
            </div>
          </div>
        </ResponsiveStack>
      </CardContent>
    </Card>
  );
};
