
import { Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerAvatar } from "./PlayerAvatar";
import { ResponsiveStack } from "./ResponsiveLayout";
import { useResponsiveBreakpoint, useOrientation } from "@/hooks/use-orientation";

interface PlayerProfileCardProps {
  player: Player;
}

export const PlayerProfileCard = ({ player }: PlayerProfileCardProps) => {
  const breakpoint = useResponsiveBreakpoint();
  const orientation = useOrientation();

  // Intelligent avatar sizing based on breakpoint and orientation
  const getAvatarSize = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'h-12 w-12' : 'h-14 w-14';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'h-16 w-16';
    }
    if (breakpoint === 'tablet-landscape') {
      return 'h-20 w-20';
    }
    return 'h-20 w-20 md:h-24 md:w-24';
  };

  // Responsive text sizing
  const getTitleSize = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'text-lg' : 'text-lg';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'text-xl';
    }
    return 'text-xl sm:text-2xl lg:text-3xl';
  };

  const getInfoTextSize = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'text-xs' : 'text-xs';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'text-sm';
    }
    return 'text-sm sm:text-base';
  };

  // Grid configuration for player info
  const getInfoGridCols = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'grid-cols-3' : 'grid-cols-1';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'grid-cols-2';
    }
    return 'grid-cols-2 lg:grid-cols-3';
  };

  // Layout direction based on breakpoint
  const getStackDirection = () => {
    if (breakpoint === 'mobile') {
      return 'vertical';
    }
    if (breakpoint === 'tablet-portrait') {
      return orientation === 'landscape' ? 'horizontal' : 'vertical';
    }
    return 'horizontal';
  };

  return (
    <Card className="bg-club-black/50 border-club-gold/20 w-full max-w-full overflow-hidden transition-all duration-300 ease-in-out">
      <CardContent className={`
        ${breakpoint === 'mobile' ? 'p-3' : 'p-4 sm:p-6'}
        transition-all duration-300 ease-in-out
      `}>
        <ResponsiveStack 
          direction={getStackDirection()}
          className={`
            items-center 
            ${getStackDirection() === 'horizontal' ? 'sm:items-start' : 'items-center'}
            gap-3 xs:gap-4 sm:gap-4 md:gap-6
          `}
        >
          <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
            <PlayerAvatar 
              player={player}
              size="lg"
              className={`
                ring-2 ring-club-gold/50 
                ${getAvatarSize()}
                transition-all duration-300 ease-in-out
              `}
            />
          </div>
          
          <div className={`
            ${getStackDirection() === 'horizontal' ? 'text-left sm:text-left' : 'text-center'} 
            flex-1 min-w-0 w-full
            transition-all duration-300 ease-in-out
          `}>
            <h2 className={`
              ${getTitleSize()} font-bold text-club-gold 
              ${breakpoint === 'mobile' ? 'mb-2' : 'mb-2 xs:mb-3'} 
              break-words leading-tight
              transition-all duration-300 ease-in-out
            `}>
              {player.name}
            </h2>
            
            <div className={`
              grid ${getInfoGridCols()} 
              gap-2 xs:gap-3 sm:gap-4 
              ${getInfoTextSize()}
              transition-all duration-300 ease-in-out
            `}>
              <div className={`
                flex 
                ${breakpoint === 'mobile' && orientation === 'portrait' ? 'flex-col' : 'flex-col xs:flex-row xs:items-center'} 
                gap-1
                transition-all duration-300 ease-in-out
              `}>
                <span className="font-medium text-club-light-gray">Position:</span>
                <span className="text-club-light-gray/80 break-words">{player.position}</span>
              </div>
              <div className={`
                flex 
                ${breakpoint === 'mobile' && orientation === 'portrait' ? 'flex-col' : 'flex-col xs:flex-row xs:items-center'} 
                gap-1
                transition-all duration-300 ease-in-out
              `}>
                <span className="font-medium text-club-light-gray">Matches:</span>
                <span className="text-club-light-gray/80">{player.matches}</span>
              </div>
              <div className={`
                flex 
                ${breakpoint === 'mobile' && orientation === 'portrait' ? 'flex-col' : 'flex-col xs:flex-row xs:items-center'} 
                gap-1
                ${getInfoGridCols() === 'grid-cols-3' ? '' : 'col-span-2 lg:col-span-1'}
                transition-all duration-300 ease-in-out
              `}>
                <span className="font-medium text-club-light-gray">Max Speed:</span>
                <span className="text-club-light-gray/80">{player.maxSpeed?.toFixed(1) || "N/A"} km/h</span>
              </div>
            </div>
            
            <div className={`
              ${breakpoint === 'mobile' ? 'mt-2' : 'mt-2 xs:mt-3'} 
              flex flex-wrap gap-1 xs:gap-2 
              ${getStackDirection() === 'horizontal' ? 'justify-start sm:justify-start' : 'justify-center'}
              transition-all duration-300 ease-in-out
            `}>
              <span className="px-2 xs:px-3 py-1 bg-club-gold/20 text-club-gold text-xs font-medium rounded-full transition-all duration-300 ease-in-out">
                Season 2023-24
              </span>
              {player.position && (
                <span className="px-2 xs:px-3 py-1 bg-club-dark-bg text-club-light-gray text-xs font-medium rounded-full transition-all duration-300 ease-in-out">
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
