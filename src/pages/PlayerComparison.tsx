
import { useState, useMemo } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { usePlayerData } from "@/hooks/use-player-data";
import { Player } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ResponsiveTable, ResponsiveTableRow, ResponsiveTableCell, ResponsiveTableHead } from "@/components/ui/responsive-table";
import { ResponsiveChart } from "@/components/ui/responsive-chart";
import { useIsMobile } from "@/hooks/use-mobile";

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function PlayerComparison() {
  const { players, loading } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const isMobile = useIsMobile();

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

  // Determine the highest value in a row for highlighting
  const getHighestValuesInRow = (statFunction: (player: Player) => number | null | undefined) => {
    if (!selectedPlayers.length) return {};
    
    const validValues = selectedPlayers
      .map(player => ({ id: player.id, value: statFunction(player) }))
      .filter(item => item.value !== null && item.value !== undefined);
      
    if (!validValues.length) return {};
    
    const maxValue = Math.max(...validValues.map(item => Number(item.value)));
    
    return validValues.reduce((acc, item) => {
      if (Number(item.value) === maxValue) {
        acc[item.id] = true;
      }
      return acc;
    }, {} as Record<number, boolean>);
  };

  // Get highest values for each stat type
  const highestDistance = useMemo(() => 
    getHighestValuesInRow(player => player.distance), [selectedPlayers]);
    
  const highestPassCompletion = useMemo(() => 
    getHighestValuesInRow(player => {
      if (!player.passes_attempted || player.passes_attempted === 0) return null;
      return (player.passes_completed / player.passes_attempted) * 100;
    }), [selectedPlayers]);
    
  const highestShotsOnTarget = useMemo(() => 
    getHighestValuesInRow(player => player.shots_on_target), [selectedPlayers]);
    
  const highestTacklesWon = useMemo(() => 
    getHighestValuesInRow(player => player.tackles_won), [selectedPlayers]);

  // Prepare data for radar chart
  const prepareRadarData = () => {
    const radarData = [
      { category: isMobile ? "Dist" : "Distance", fullMark: 100 },
      { category: isMobile ? "Shots" : "Shots on Target", fullMark: 100 },
      { category: isMobile ? "Passes" : "Passes Completed", fullMark: 100 },
      { category: isMobile ? "Tackles" : "Tackles Won", fullMark: 100 }
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

  const radarData = useMemo(() => prepareRadarData(), [selectedPlayers, isMobile]);
  const chartConfig = useMemo(() => {
    const config: Record<string, { color: string }> = {};
    
    selectedPlayers.forEach((player, index) => {
      config[player.name] = { 
        color: playerColors[index % playerColors.length]
      };
    });
    
    return config;
  }, [selectedPlayers]);

  // Prepare table data for mobile cards
  const prepareTableData = () => {
    return selectedPlayers.map(player => ({
      id: player.id,
      title: player.name,
      data: {
        "Total Distance (km)": player.distance ? player.distance.toFixed(1) : "N/A",
        "Pass Completion %": player.passes_attempted && player.passes_attempted > 0 
          ? formatPercentage(getPassCompletionPercentage(player)) 
          : "N/A",
        "Shots on Target": player.shots_on_target !== null && player.shots_on_target !== undefined 
          ? player.shots_on_target 
          : "N/A",
        "Tackles Won": player.tackles_won !== null && player.tackles_won !== undefined 
          ? player.tackles_won 
          : "N/A"
      }
    }));
  };

  // Simplified mobile chart view
  const SimplifiedMobileChart = () => (
    <div className="space-y-4">
      {selectedPlayers.map((player, index) => (
        <div key={player.id} className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <PlayerAvatar player={player} size="sm" />
            <span className="font-medium">{player.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Distance</div>
              <div className="font-semibold">{player.distance?.toFixed(1) || 'N/A'} km</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Shots</div>
              <div className="font-semibold">{player.shots_on_target || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Passes</div>
              <div className="font-semibold">{player.passes_completed || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Tackles</div>
              <div className="font-semibold">{player.tackles_won || 'N/A'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Player Comparison</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Compare stats between multiple players (select 2-4 players)
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Player Selection</CardTitle>
            <CardDescription className="text-sm">
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Performance Metrics Comparison</CardTitle>
                <CardDescription className="text-sm">
                  Key performance indicators for the selected players
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isMobile ? (
                  <div className="space-y-4">
                    {prepareTableData().map((playerData) => (
                      <ResponsiveTableRow
                        key={playerData.id}
                        data={playerData.data}
                        title={
                          <div className="flex items-center gap-2">
                            <PlayerAvatar 
                              player={selectedPlayers.find(p => p.id === playerData.id)!}
                              size="sm"
                            />
                            <span>{playerData.title}</span>
                          </div>
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <ResponsiveTable>
                    <thead>
                      <tr>
                        <ResponsiveTableHead>Metric</ResponsiveTableHead>
                        {selectedPlayers.map((player) => (
                          <ResponsiveTableHead key={player.id} className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <PlayerAvatar 
                                player={player}
                                size="sm"
                              />
                              <span>{player.name}</span>
                            </div>
                          </ResponsiveTableHead>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ResponsiveTableRow>
                        <ResponsiveTableCell className="font-medium">Total Distance (km)</ResponsiveTableCell>
                        {selectedPlayers.map((player) => (
                          <ResponsiveTableCell 
                            key={`distance-${player.id}`} 
                            className={`text-center ${highestDistance[player.id] ? 'bg-green-100/10' : ''}`}
                          >
                            {player.distance ? 
                              player.distance.toFixed(1) : 
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
                            }
                          </ResponsiveTableCell>
                        ))}
                      </ResponsiveTableRow>
                      <ResponsiveTableRow>
                        <ResponsiveTableCell className="font-medium">Pass Completion %</ResponsiveTableCell>
                        {selectedPlayers.map((player) => (
                          <ResponsiveTableCell 
                            key={`passes-${player.id}`} 
                            className={`text-center ${highestPassCompletion[player.id] ? 'bg-green-100/10' : ''}`}
                          >
                            {player.passes_attempted && player.passes_attempted > 0 ?
                              formatPercentage(getPassCompletionPercentage(player)) :
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
                            }
                          </ResponsiveTableCell>
                        ))}
                      </ResponsiveTableRow>
                      <ResponsiveTableRow>
                        <ResponsiveTableCell className="font-medium">Shots on Target</ResponsiveTableCell>
                        {selectedPlayers.map((player) => (
                          <ResponsiveTableCell 
                            key={`shots-${player.id}`} 
                            className={`text-center ${highestShotsOnTarget[player.id] ? 'bg-green-100/10' : ''}`}
                          >
                            {player.shots_on_target !== null && player.shots_on_target !== undefined ?
                              player.shots_on_target :
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
                            }
                          </ResponsiveTableCell>
                        ))}
                      </ResponsiveTableRow>
                      <ResponsiveTableRow>
                        <ResponsiveTableCell className="font-medium">Tackles Won</ResponsiveTableCell>
                        {selectedPlayers.map((player) => (
                          <ResponsiveTableCell 
                            key={`tackles-${player.id}`} 
                            className={`text-center ${highestTacklesWon[player.id] ? 'bg-green-100/10' : ''}`}
                          >
                            {player.tackles_won !== null && player.tackles_won !== undefined ?
                              player.tackles_won :
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
                            }
                          </ResponsiveTableCell>
                        ))}
                      </ResponsiveTableRow>
                    </tbody>
                  </ResponsiveTable>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Performance Radar Chart</CardTitle>
                <CardDescription className="text-sm">
                  Visual comparison of player attributes across key categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveChart
                  config={chartConfig}
                  showZoomControls={true}
                  simplifiedMobileView={<SimplifiedMobileChart />}
                  aspectRatio={isMobile ? 1 : (4/3)}
                  minHeight={isMobile ? 300 : 400}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} className="mx-auto">
                      <PolarGrid />
                      <PolarAngleAxis 
                        dataKey="category" 
                        className="text-xs sm:text-sm" 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      
                      {selectedPlayers.map((player, index) => (
                        <Radar
                          key={player.id}
                          name={player.name}
                          dataKey={player.name}
                          stroke={playerColors[index % playerColors.length]}
                          fill={playerColors[index % playerColors.length]}
                          fillOpacity={0.2}
                          strokeWidth={isMobile ? 1.5 : 2}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </ResponsiveChart>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <BackToTopButton />
    </DashboardLayout>
  );
}
