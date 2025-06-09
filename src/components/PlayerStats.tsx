
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { SwipeNavigation } from "./ui/swipe-navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  const [currentSection, setCurrentSection] = useState(0);
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center px-4">
        <div className="space-y-3">
          <p className={`text-club-light-gray ${isMobile ? 'text-lg' : 'text-base sm:text-lg lg:text-xl'}`}>
            No player selected
          </p>
          <p className={`text-club-light-gray/60 ${isMobile ? 'text-base' : 'text-sm'}`}>
            Please select a player to view their statistics
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      name: "Overview",
      content: (
        <div className="space-y-4">
          <PlayerProfileCard player={player} />
          <PlayerStatCards player={player} />
        </div>
      )
    },
    {
      name: "Performance",
      content: isMobile ? (
        <MobilePerformanceTrends player={player} />
      ) : (
        <PlayerPerformanceSection player={player} />
      )
    },
    {
      name: "Analysis", 
      content: <PlayerHeatmapTackleSection player={player} />
    }
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (direction === 'right' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (isMobile) {
    return (
      <ResponsiveLayout className="w-full max-w-7xl mx-auto px-0">
        <div className="space-y-4">
          {/* Section tabs for mobile */}
          <div className="flex overflow-x-auto bg-card rounded-lg p-1 mx-4">
            {sections.map((section, index) => (
              <button
                key={section.name}
                onClick={() => setCurrentSection(index)}
                className={`
                  flex-1 min-w-0 px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${currentSection === index 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {section.name}
              </button>
            ))}
          </div>

          {/* Swipeable content */}
          <SwipeNavigation
            currentIndex={currentSection}
            onSwipe={handleSwipe}
            className="min-h-[400px]"
          >
            {sections.map((section, index) => (
              <div key={section.name} className="px-4">
                {section.content}
              </div>
            ))}
          </SwipeNavigation>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="space-y-6">
        <div className="transition-all duration-300 ease-in-out">
          <PlayerProfileCard player={player} />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          <PlayerStatCards player={player} />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          <PlayerPerformanceSection player={player} />
        </div>

        <div className="transition-all duration-300 ease-in-out">
          <PlayerHeatmapTackleSection player={player} />
        </div>
      </div>
    </ResponsiveLayout>
  );
};
