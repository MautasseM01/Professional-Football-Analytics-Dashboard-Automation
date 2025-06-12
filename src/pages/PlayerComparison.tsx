
import { useState, useMemo } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { usePlayerData } from "@/hooks/use-player-data";
import { Player } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Badge } from "@/components/ui/badge";
import { UserRound, TrendingUp, BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BackToTopButton } from "@/components/BackToTopButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ResponsiveChartContainer } from "@/components/ResponsiveChartContainer";
import { TableLoadingSkeleton, ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function PlayerComparison() {
  const { players, loading } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

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
    <ErrorBoundary>
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-6 animate-fade-in">
          {/* Header - iPhone weather style */}
          <div className={cn(
            "rounded-2xl p-6 backdrop-blur-sm transition-all duration-300",
            theme === 'dark' 
              ? "bg-club-dark-gray/60 border border-club-gold/20" 
              : "bg-white/80 border border-club-gold/30",
            "shadow-xl"
          )}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-xl",
                theme === 'dark' 
                  ? "bg-club-gold/20" 
                  : "bg-club-gold/10"
              )}>
                <BarChart3 className="h-6 w-6 text-club-gold" />
              </div>
              <h1 className={cn(
                "text-2xl sm:text-3xl font-bold",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Player Comparison
              </h1>
            </div>
            <p className={cn(
              "text-sm sm:text-base",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>
              Compare performance metrics between multiple players (select 2-4 players)
            </p>
          </div>

          {/* Player Selection Card - iPhone weather style */}
          <Card className={cn(
            "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
            theme === 'dark' 
              ? "bg-club-dark-gray/60" 
              : "bg-white/80",
            "shadow-xl"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-club-gold" />
                <div>
                  <CardTitle className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    Player Selection
                  </CardTitle>
                  <CardDescription className={cn(
                    "text-sm",
                    theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                  )}>
                    Select 2 to 4 players to compare their performance metrics
                  </CardDescription>
                </div>
              </div>
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
              {/* Performance Metrics Table - iPhone weather style */}
              <Card className={cn(
                "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
                theme === 'dark' 
                  ? "bg-club-dark-gray/60" 
                  : "bg-white/80",
                "shadow-xl animate-fade-in"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-club-gold" />
                    <div>
                      <CardTitle className={cn(
                        "text-lg font-semibold",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}>
                        Performance Metrics Comparison
                      </CardTitle>
                      <CardDescription className={cn(
                        "text-sm",
                        theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                      )}>
                        Key performance indicators for the selected players
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <TableLoadingSkeleton rows={4} columns={selectedPlayers.length + 1} />
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className={cn(
                            theme === 'dark' 
                              ? "border-club-gold/20" 
                              : "border-club-gold/30"
                          )}>
                            <TableHead className={cn(
                              "font-semibold",
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              Metric
                            </TableHead>
                            {selectedPlayers.map((player) => (
                              <TableHead key={player.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <PlayerAvatar 
                                    player={player}
                                    size="sm"
                                  />
                                  <span className={cn(
                                    "font-medium text-sm",
                                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                  )}>
                                    {isMobile ? player.name.split(' ')[0] : player.name}
                                  </span>
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className={cn(
                            "transition-colors duration-200",
                            theme === 'dark' 
                              ? "border-club-gold/10 hover:bg-club-black/20" 
                              : "border-club-gold/20 hover:bg-gray-50/50"
                          )}>
                            <TableCell className={cn(
                              "font-medium",
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              {isMobile ? "Distance" : "Total Distance (km)"}
                            </TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell 
                                key={`distance-${player.id}`} 
                                className={cn(
                                  "text-center transition-all duration-200",
                                  highestDistance[player.id] 
                                    ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                    : theme === 'dark' 
                                    ? "text-club-light-gray" 
                                    : "text-gray-900"
                                )}
                              >
                                {player.distance ? 
                                  player.distance.toFixed(1) : 
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className={cn(
                            "transition-colors duration-200",
                            theme === 'dark' 
                              ? "border-club-gold/10 hover:bg-club-black/20" 
                              : "border-club-gold/20 hover:bg-gray-50/50"
                          )}>
                            <TableCell className={cn(
                              "font-medium",
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              {isMobile ? "Pass %" : "Pass Completion %"}
                            </TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell 
                                key={`passes-${player.id}`} 
                                className={cn(
                                  "text-center transition-all duration-200",
                                  highestPassCompletion[player.id] 
                                    ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                    : theme === 'dark' 
                                    ? "text-club-light-gray" 
                                    : "text-gray-900"
                                )}
                              >
                                {player.passes_attempted && player.passes_attempted > 0 ?
                                  formatPercentage(getPassCompletionPercentage(player)) :
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className={cn(
                            "transition-colors duration-200",
                            theme === 'dark' 
                              ? "border-club-gold/10 hover:bg-club-black/20" 
                              : "border-club-gold/20 hover:bg-gray-50/50"
                          )}>
                            <TableCell className={cn(
                              "font-medium",
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              {isMobile ? "Shots" : "Shots on Target"}
                            </TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell 
                                key={`shots-${player.id}`} 
                                className={cn(
                                  "text-center transition-all duration-200",
                                  highestShotsOnTarget[player.id] 
                                    ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                    : theme === 'dark' 
                                    ? "text-club-light-gray" 
                                    : "text-gray-900"
                                )}
                              >
                                {player.shots_on_target !== null && player.shots_on_target !== undefined ?
                                  player.shots_on_target :
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow className={cn(
                            "transition-colors duration-200",
                            theme === 'dark' 
                              ? "border-club-gold/10 hover:bg-club-black/20" 
                              : "border-club-gold/20 hover:bg-gray-50/50"
                          )}>
                            <TableCell className={cn(
                              "font-medium",
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              {isMobile ? "Tackles" : "Tackles Won"}
                            </TableCell>
                            {selectedPlayers.map((player) => (
                              <TableCell 
                                key={`tackles-${player.id}`} 
                                className={cn(
                                  "text-center transition-all duration-200",
                                  highestTacklesWon[player.id] 
                                    ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                    : theme === 'dark' 
                                    ? "text-club-light-gray" 
                                    : "text-gray-900"
                                )}
                              >
                                {player.tackles_won !== null && player.tackles_won !== undefined ?
                                  player.tackles_won :
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Radar Chart - iPhone weather style */}
              <Card className={cn(
                "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
                theme === 'dark' 
                  ? "bg-club-dark-gray/60" 
                  : "bg-white/80",
                "shadow-xl animate-fade-in"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-club-gold" />
                    <div>
                      <CardTitle className={cn(
                        "text-lg font-semibold",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}>
                        Performance Radar Chart
                      </CardTitle>
                      <CardDescription className={cn(
                        "text-sm",
                        theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                      )}>
                        Visual comparison of player attributes across key categories
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <ChartLoadingSkeleton showHeader={false} />
                  ) : (
                    <div className={cn(
                      "w-full rounded-2xl p-4 transition-all duration-300",
                      theme === 'dark' 
                        ? "bg-club-black/20 border border-club-gold/10" 
                        : "bg-gray-50/30 border border-club-gold/20"
                    )}>
                      <ResponsiveChartContainer 
                        config={chartConfig}
                        aspectRatio={isMobile ? 1 : 1.5}
                        minHeight={isMobile ? 300 : 400}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} className="mx-auto">
                            <PolarGrid stroke={theme === 'dark' ? "#333" : "#e5e7eb"} />
                            <PolarAngleAxis 
                              dataKey="category" 
                              tick={{ 
                                fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                                fontSize: isMobile ? 10 : 12 
                              }}
                            />
                            
                            {selectedPlayers.map((player, index) => (
                              <Radar
                                key={player.id}
                                name={player.name}
                                dataKey={player.name}
                                stroke={playerColors[index % playerColors.length]}
                                fill={playerColors[index % playerColors.length]}
                                fillOpacity={0.2}
                                strokeWidth={2}
                              />
                            ))}
                          </RadarChart>
                        </ResponsiveContainer>
                      </ResponsiveChartContainer>
                      
                      {/* Legend for mobile */}
                      {isMobile && selectedPlayers.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {selectedPlayers.map((player, index) => (
                            <div key={player.id} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: playerColors[index % playerColors.length] }}
                              />
                              <span className="text-xs font-medium text-club-light-gray truncate">
                                {player.name.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Back to Top Button */}
        <BackToTopButton />
      </DashboardLayout>
    </ErrorBoundary>
  );
}
