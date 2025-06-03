
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerAvatar } from "./PlayerAvatar";
import { ResponsiveStack } from "./ResponsiveLayout";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  return (
    <Card className="bg-club-black/50 border-club-gold/20 w-full max-w-full overflow-hidden transition-all duration-300 ease-in-out">
      <CardContent className="p-responsive-4 md:p-responsive-6">
        <ResponsiveStack 
          direction="auto"
          className="items-center sm:items-start gap-4 md:gap-6"
        >
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
            <PlayerAvatar 
              player={player}
              size="lg"
              className="ring-2 ring-club-gold/50 h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-all duration-300 ease-in-out"
            />
          </div>
          
          <div className="text-center sm:text-left flex-1 min-w-0 w-full">
            <h2 className="heading-secondary break-words">
              {player.name}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-responsive-sm font-medium text-club-light-gray">Position:</span>
                <span className="text-responsive-sm text-club-light-gray/80 break-words">{player.position}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-responsive-sm font-medium text-club-light-gray">Matches:</span>
                <span className="text-responsive-sm text-club-light-gray/80">{player.matches}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 col-span-1 sm:col-span-2 lg:col-span-1">
                <span className="text-responsive-sm font-medium text-club-light-gray">Max Speed:</span>
                <span className="text-responsive-sm text-club-light-gray/80">{player.maxSpeed?.toFixed(1) || "N/A"} km/h</span>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-club-gold/20 text-club-gold text-responsive-xs font-medium rounded-full">
                Season 2023-24
              </span>
              {player.position && (
                <span className="px-3 py-1 bg-club-dark-bg text-club-light-gray text-responsive-xs font-medium rounded-full">
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
