
import { useState, useMemo } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { usePlayerData } from "@/hooks/use-player-data";
import { Player } from "@/types";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function PlayerComparison() {
  const { players, loading } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  const selectedPlayers = useMemo(() => {
    if (!players?.length || !selectedPlayerIds.length) return [];
    
    return players.filter(player => selectedPlayerIds.includes(player.id));
  }, [players, selectedPlayerIds]);

  const handlePlayerSelectionChange = (playerIds: number[]) => {
    // Limit to a maximum of 4 players
    if (playerIds.length <= 4) {
      setSelectedPlayerIds(playerIds);
    }
  };

  // Calculate pass completion percentages
  const getPassCompletionPercentage = (player: Player): number => {
    if (!player.passes_attempted || player.passes_attempted === 0) return 0;
    return (player.passes_completed / player.passes_attempted) * 100;
  };

  // Prepare data for radar chart
  const prepareRadarData = () => {
    const radarData = [
      { category: "Distance", fullMark: 100 },
      { category: "Shots on Target", fullMark: 100 },
      { category: "Passes Completed", fullMark: 100 },
      { category: "Tackles Won", fullMark: 100 }
    ];

    // Find max values to normalize data
    const maxValues = {
      distance: Math.max(...selectedPlayers.map(p => p.distance || 0), 1),
      shots_on_target: Math.max(...selectedPlayers.map(p => p.shots_on_target || 0), 1),
      passes_completed: Math.max(...selectedPlayers.map(p => p.passes_completed || 0), 1),
      tackles_won: Math.max(...selectedPlayers.map(p => p.tackles_won || 0), 1)
    };

    // Add player data to radar chart
    selectedPlayers.forEach(player => {
      radarData[0][player.name] = player.distance 
        ? (player.distance / maxValues.distance) * 100 
        : 0;
        
      radarData[1][player.name] = player.shots_on_target 
        ? (player.shots_on_target / maxValues.shots_on_target) * 100 
        : 0;
        
      radarData[2][player.name] = player.passes_completed 
        ? (player.passes_completed / maxValues.passes_completed) * 100 
        : 0;
        
      radarData[3][player.name] = player.tackles_won 
        ? (player.tackles_won / maxValues.tackles_won) * 100 
        : 0;
    });

    return radarData;
  };

  // Generate chart colors for each player
  const playerColors = [
    "#3498db", // Blue
    "#e74c3c", // Red
    "#2ecc71", // Green
    "#f39c12"  // Orange
  ];

  const radarData = useMemo(() => prepareRadarData(), [selectedPlayers]);
  const chartConfig = useMemo(() => {
    const config: Record<string, { color: string }> = {};
    
    selectedPlayers.forEach((player, index) => {
      config[player.name] = { 
        color: playerColors[index % playerColors.length]
      };
    });
    
    return config;
  }, [selectedPlayers]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Player Comparison</h1>
        <p className="text-muted-foreground">
          Compare stats between multiple players (select 2-4 players)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Selection</CardTitle>
          <CardDescription>
            Select 2 to 4 players to compare their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiPlayerSelect 
            players={players || []}
            selectedPlayerIds={selectedPlayerIds}
            onChange={handlePlayerSelectionChange}
            loading={loading}
            maxSelections={4}
          />
        </CardContent>
      </Card>

      {selectedPlayers.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
              <CardDescription>
                Key performance indicators for the selected players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      {selectedPlayers.map((player) => (
                        <TableHead key={player.id} className="text-center">
                          {player.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Distance (km)</TableCell>
                      {selectedPlayers.map((player) => (
                        <TableCell key={`distance-${player.id}`} className="text-center">
                          {player.distance ? player.distance.toFixed(1) : "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pass Completion %</TableCell>
                      {selectedPlayers.map((player) => (
                        <TableCell key={`passes-${player.id}`} className="text-center">
                          {player.passes_attempted && player.passes_attempted > 0
                            ? formatPercentage(getPassCompletionPercentage(player))
                            : "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Shots on Target</TableCell>
                      {selectedPlayers.map((player) => (
                        <TableCell key={`shots-${player.id}`} className="text-center">
                          {player.shots_on_target ?? "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tackles Won</TableCell>
                      {selectedPlayers.map((player) => (
                        <TableCell key={`tackles-${player.id}`} className="text-center">
                          {player.tackles_won ?? "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Radar Chart</CardTitle>
              <CardDescription>
                Visual comparison of player attributes across key categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[500px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} className="mx-auto">
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      
                      {selectedPlayers.map((player, index) => (
                        <Radar
                          key={player.id}
                          name={player.name}
                          dataKey={player.name}
                          stroke={playerColors[index % playerColors.length]}
                          fill={playerColors[index % playerColors.length]}
                          fillOpacity={0.2}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                  <ChartLegend>
                    <ChartLegendContent payload={selectedPlayers.map((player, index) => ({
                      value: player.name,
                      color: playerColors[index % playerColors.length],
                      dataKey: player.name
                    }))} />
                  </ChartLegend>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
