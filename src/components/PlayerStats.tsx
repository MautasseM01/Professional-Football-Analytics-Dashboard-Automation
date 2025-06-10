
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { IOSPerformanceTrends } from "./IOSPerformanceTrends";
import { IOSFormationViewer } from "./IOSFormationViewer";
import { EnhancedPlayerHeatmap } from "./HeatmapVisualization";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlayerData } from "@/hooks/use-player-data";
import { cn } from "@/lib/utils";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  const { players } = usePlayerData();
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center container-responsive p-4">
        <div className="space-y-3">
          <p className={cn(
            "text-club-light-gray font-medium",
            isMobile ? "text-lg" : "text-xl"
          )}>
            No player selected
          </p>
          <p className={cn(
            "text-club-light-gray/60",
            isMobile ? "text-sm" : "text-base"
          )}>
            Please select a player to view their statistics
          </p>
        </div>
      </div>
    );
  }

  // Mock formations data
  const mockFormations = [
    {
      id: '1',
      name: '4-4-2',
      time: '0-45\'',
      players: [
        { id: '1', name: 'Goalkeeper', position: { x: 50, y: 90 }, role: 'goalkeeper' as const, number: 1 },
        { id: '2', name: 'RB', position: { x: 80, y: 70 }, role: 'defender' as const, number: 2 },
        { id: '3', name: 'CB', position: { x: 60, y: 75 }, role: 'defender' as const, number: 3 },
        { id: '4', name: 'CB', position: { x: 40, y: 75 }, role: 'defender' as const, number: 4 },
        { id: '5', name: 'LB', position: { x: 20, y: 70 }, role: 'defender' as const, number: 5 },
        { id: '6', name: 'RM', position: { x: 80, y: 45 }, role: 'midfielder' as const, number: 6 },
        { id: '7', name: 'CM', position: { x: 60, y: 50 }, role: 'midfielder' as const, number: 7 },
        { id: '8', name: 'CM', position: { x: 40, y: 50 }, role: 'midfielder' as const, number: 8 },
        { id: '9', name: 'LM', position: { x: 20, y: 45 }, role: 'midfielder' as const, number: 9 },
        { id: '10', name: 'ST', position: { x: 60, y: 25 }, role: 'forward' as const, number: 10 },
        { id: '11', name: 'ST', position: { x: 40, y: 25 }, role: 'forward' as const, number: 11 }
      ]
    },
    {
      id: '2',
      name: '4-3-3',
      time: '45-90\'',
      players: [
        { id: '1', name: 'Goalkeeper', position: { x: 50, y: 90 }, role: 'goalkeeper' as const, number: 1 },
        { id: '2', name: 'RB', position: { x: 80, y: 70 }, role: 'defender' as const, number: 2 },
        { id: '3', name: 'CB', position: { x: 60, y: 75 }, role: 'defender' as const, number: 3 },
        { id: '4', name: 'CB', position: { x: 40, y: 75 }, role: 'defender' as const, number: 4 },
        { id: '5', name: 'LB', position: { x: 20, y: 70 }, role: 'defender' as const, number: 5 },
        { id: '6', name: 'CDM', position: { x: 50, y: 60 }, role: 'midfielder' as const, number: 6 },
        { id: '7', name: 'CM', position: { x: 65, y: 45 }, role: 'midfielder' as const, number: 7 },
        { id: '8', name: 'CM', position: { x: 35, y: 45 }, role: 'midfielder' as const, number: 8 },
        { id: '9', name: 'RW', position: { x: 80, y: 25 }, role: 'forward' as const, number: 9 },
        { id: '10', name: 'ST', position: { x: 50, y: 20 }, role: 'forward' as const, number: 10 },
        { id: '11', name: 'LW', position: { x: 20, y: 25 }, role: 'forward' as const, number: 11 }
      ]
    }
  ];

  return (
    <ResponsiveLayout className="w-full max-w-7xl mx-auto container-responsive">
      <div className={cn(
        "space-y-4",
        isMobile ? "space-y-4 px-4" : "space-y-6 lg:space-y-8"
      )}>
        {/* Player Profile Card */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerProfileCard player={player} />
        </div>

        {/* Stats Cards Grid */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerStatCards player={player} />
        </div>

        {/* Enhanced iOS-Style Performance Trends */}
        <div className="transition-all duration-300 ease-in-out">
          <IOSPerformanceTrends
            playerId={player.id.toString()}
            playerName={player.name}
            player={player}
          />
        </div>

        {/* Enhanced Player Heatmap with full data integration */}
        <div className="transition-all duration-300 ease-in-out">
          <EnhancedPlayerHeatmap
            players={players}
            selectedPlayer={player}
            onPlayerChange={(newPlayer) => {
              // This would typically update the parent component's selected player
              console.log('Player changed to:', newPlayer.name);
            }}
          />
        </div>

        {/* iOS-Style Formation Viewer */}
        <div className="transition-all duration-300 ease-in-out">
          <IOSFormationViewer
            formations={mockFormations}
          />
        </div>

        {/* Heatmap and Tackle Success Cards - keeping for backward compatibility */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerHeatmapTackleSection player={player} />
        </div>
      </div>
    </ResponsiveLayout>
  );
};
