
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
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-club-gold mb-2">
              Player Analytics Dashboard
            </h1>
            <p className="text-club-light-gray/70">
              View detailed statistics for each player
            </p>
          </div>

          <div className="bg-club-black/40 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-club-gold mb-4">Player Selection</h2>
            <p className="text-club-light-gray/70 mb-6">Choose a player to view their analytics</p>
            
            <div className="w-full max-w-xl">
              <Select value={selectedPlayerId} onValueChange={handlePlayerChange}>
                <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-club-gold" />
                    <SelectValue placeholder="Select a player" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name} - {player.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PDF Report Generation Card */}
          <Card className="border-club-gold/20 bg-club-dark-gray mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-club-gold flex items-center justify-between">
                <span>Player Performance Report</span>
                <PDFReportGenerator 
                  player={selectedPlayer}
                  attributes={attributes}
                  positionalAverage={positionalAverage}
                  coachNotes={coachNotes}
                  performanceData={performanceData}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-club-light-gray/80">
                Generate a comprehensive PDF report including the player's performance data, radar charts, 
                and your personalized coaching notes.
              </p>
              <CoachNotesTextarea 
                value={coachNotes}
                onChange={setCoachNotes}
              />
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-8">Loading player data...</div>
          ) : error ? (
            <div className="text-red-500 py-8">Error loading player data: {error}</div>
          ) : (
            <>
              {/* Role Radar Chart */}
              <div className="mb-8">
                <RoleRadarChart 
                  player={selectedPlayer}
                  attributes={attributes}
                  positionalAverage={positionalAverage}
                  loading={attrLoading}
                  error={attrError}
                />
              </div>
              
              {/* Existing Player Stats Component */}
              <PlayerStatsComponent player={selectedPlayer} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerStats;
