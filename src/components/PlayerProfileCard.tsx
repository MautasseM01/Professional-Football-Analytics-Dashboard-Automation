
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerAvatar } from "./PlayerAvatar";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  return (
    <Card className="bg-club-black/50 border-club-gold/20 w-full max-w-full overflow-hidden">
      <CardContent className="p-3 xs:p-4 sm:p-6">
        <div className="flex flex-col items-center gap-3 xs:gap-4 sm:flex-row sm:items-start sm:gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <PlayerAvatar 
              player={player}
              size="lg"
              className="ring-2 ring-club-gold/50 
                h-14 w-14 xs:h-16 xs:w-16 
                sm:h-20 sm:w-20 
                md:h-24 md:w-24"
            />
          </div>
          
          <div className="text-center sm:text-left flex-1 min-w-0 w-full">
            <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2 xs:mb-3 break-words leading-tight">
              {player.name}
            </h2>
            
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm sm:text-base">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1">
                <span className="font-medium text-club-light-gray">Position:</span>
                <span className="text-club-light-gray/80 break-words">{player.position}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-1">
                <span className="font-medium text-club-light-gray">Matches:</span>
                <span className="text-club-light-gray/80">{player.matches}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-1">
                <span className="font-medium text-club-light-gray">Max Speed:</span>
                <span className="text-club-light-gray/80">{player.maxSpeed?.toFixed(1) || "N/A"} km/h</span>
              </div>
            </div>
            
            <div className="mt-2 xs:mt-3 flex flex-wrap gap-1 xs:gap-2 justify-center sm:justify-start">
              <span className="px-2 xs:px-3 py-1 bg-club-gold/20 text-club-gold text-xs font-medium rounded-full">
                Season 2023-24
              </span>
              {player.position && (
                <span className="px-2 xs:px-3 py-1 bg-club-dark-bg text-club-light-gray text-xs font-medium rounded-full">
                  {player.position}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
