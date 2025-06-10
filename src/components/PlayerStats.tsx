
import { Player } from "@/types";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerStatCards } from "./PlayerStatCards";
import { PlayerHeatmapTackleSection } from "./PlayerHeatmapTackleSection";
import { PlayerPerformanceSection } from "./PlayerPerformanceSection";
import { MobilePerformanceTrends } from "./MobilePerformanceTrends";
import { IOSHeatmapVisualization } from "./IOSHeatmapVisualization";
import { IOSPerformanceTrends } from "./IOSPerformanceTrends";
import { IOSFormationViewer } from "./IOSFormationViewer";
import { ResponsiveLayout } from "./ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  const isMobile = useIsMobile();
  
  console.log("PlayerStats component received player:", player);
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center container-responsive">
        <div className="space-y-3">
          <p className="text-lg sm:text-xl text-club-light-gray">
            No player selected
          </p>
          <p className="text-sm text-club-light-gray/60">
            Please select a player to view their statistics
          </p>
        </div>
      </div>
    );
  }

  // Mock data for the new iOS-style components
  const mockHeatmapData = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    intensity: Math.random()
  }));

  const mockPerformanceData = Array.from({ length: 10 }, (_, i) => ({
    match: i + 1,
    date: `Game ${i + 1}`,
    goals: Math.floor(Math.random() * 3),
    assists: Math.floor(Math.random() * 3),
    passes: Math.floor(Math.random() * 50) + 30,
    distance: Math.round((Math.random() * 3 + 7) * 10) / 10,
    rating: Math.round((Math.random() * 3 + 6) * 10) / 10
  }));

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
      <div className="space-y-6 sm:space-y-7 lg:space-y-8">
        {/* Player Profile Card */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerProfileCard player={player} />
        </div>

        {/* Stats Cards Grid */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerStatCards player={player} />
        </div>

        {/* iOS-Style Performance Trends */}
        <div className="transition-all duration-300 ease-in-out">
          <IOSPerformanceTrends
            playerId={player.id}
            playerName={player.name}
            performanceData={mockPerformanceData}
          />
        </div>

        {/* iOS-Style Heatmap */}
        <div className="transition-all duration-300 ease-in-out">
          <IOSHeatmapVisualization
            playerId={player.id}
            playerName={player.name}
            heatmapData={mockHeatmapData}
          />
        </div>

        {/* iOS-Style Formation Viewer */}
        <div className="transition-all duration-300 ease-in-out">
          <IOSFormationViewer
            formations={mockFormations}
          />
        </div>

        {/* Legacy Performance Section for Desktop */}
        {!isMobile && (
          <div className="transition-all duration-300 ease-in-out">
            <PlayerPerformanceSection player={player} />
          </div>
        )}

        {/* Heatmap and Tackle Success Cards */}
        <div className="transition-all duration-300 ease-in-out">
          <PlayerHeatmapTackleSection player={player} />
        </div>
      </div>
    </ResponsiveLayout>
  );
};
