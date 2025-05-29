
import { usePlayerData } from "@/hooks/use-player-data";
import { usePlayerAttributes } from "@/hooks/use-player-attributes";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PlayerStats as PlayerStatsComponent } from "@/components/PlayerStats";
import { RoleRadarChart } from "@/components/RoleRadarChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { CoachNotesTextarea } from "@/components/CoachNotesTextarea";
import { PDFReportGenerator } from "@/components/PDFReportGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlayerStats = () => {
  const { players, selectedPlayer, selectPlayer, loading, error } = usePlayerData();
  const { attributes, positionalAverage, loading: attrLoading, error: attrError } = usePlayerAttributes(selectedPlayer);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [coachNotes, setCoachNotes] = useState<string>("");
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Set the selected player ID when players data is loaded
  useEffect(() => {
    if (players.length > 0 && !selectedPlayerId) {
      setSelectedPlayerId(players[0].id.toString());
      selectPlayer(players[0].id);
    }
  }, [players, selectedPlayerId, selectPlayer]);

  // Generate sample performance data for the selected player
  useEffect(() => {
    if (selectedPlayer) {
      // Generate mock performance trend data for the Total Distance metric
      const mockData = Array.from({ length: 10 }, (_, i) => {
        const baseValue = selectedPlayer.distance || 8;
        const variation = (Math.random() * 2 - 1) * 1.5; // Random variation between -1.5 and 1.5
        return {
          match: `Match ${i+1}`,
          date: new Date(2023, 0, i+1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.max(5, Number((baseValue + variation).toFixed(2))),
        };
      });
      
      setPerformanceData(mockData);
    }
  }, [selectedPlayer]);

  const handlePlayerChange = (value: string) => {
    setSelectedPlayerId(value);
    selectPlayer(Number(value));
    // Reset coach's notes when changing players
    setCoachNotes("");
  };

  return (
    <div className="flex min-h-screen bg-club-dark-bg text-club-light-gray">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">
              Player Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-club-light-gray/70 max-w-2xl">
              View detailed statistics and performance analytics for individual players
            </p>
          </div>

          {/* Player Selection Section */}
          <Card className="bg-club-black/40 border-club-gold/20">
            <CardHeader className="p-4 sm:p-6 pb-4">
              <CardTitle className="text-lg sm:text-xl text-club-gold">Player Selection</CardTitle>
              <p className="text-sm text-club-light-gray/70">Choose a player to view their comprehensive analytics</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="w-full max-w-md">
                <Select value={selectedPlayerId} onValueChange={handlePlayerChange}>
                  <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray h-12 focus:ring-club-gold/50">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-club-gold flex-shrink-0" />
                      <SelectValue placeholder="Select a player" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray z-50 max-h-60">
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()} className="focus:bg-club-gold/20">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{player.name}</span>
                          <span className="text-club-light-gray/60 text-sm ml-2">{player.position}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* PDF Report Generation Card */}
          <Card className="border-club-gold/20 bg-club-dark-gray">
            <CardHeader className="p-4 sm:p-6 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg sm:text-xl text-club-gold">
                  Player Performance Report
                </CardTitle>
                <PDFReportGenerator 
                  player={selectedPlayer}
                  attributes={attributes}
                  positionalAverage={positionalAverage}
                  coachNotes={coachNotes}
                  performanceData={performanceData}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <p className="text-sm sm:text-base text-club-light-gray/80 leading-relaxed">
                Generate a comprehensive PDF report including the player's performance data, radar charts, 
                and your personalized coaching notes for detailed analysis and record-keeping.
              </p>
              <CoachNotesTextarea 
                value={coachNotes}
                onChange={setCoachNotes}
              />
            </CardContent>
          </Card>

          {/* Loading and Error States */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-club-gold mx-auto"></div>
                <p className="text-club-light-gray">Loading player data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-medium mb-2">Error loading player data</div>
              <p className="text-club-light-gray/70">{error}</p>
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              {/* Role Radar Chart */}
              <RoleRadarChart 
                player={selectedPlayer}
                attributes={attributes}
                positionalAverage={positionalAverage}
                loading={attrLoading}
                error={attrError}
              />
              
              {/* Player Stats Component */}
              <PlayerStatsComponent player={selectedPlayer} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerStats;
