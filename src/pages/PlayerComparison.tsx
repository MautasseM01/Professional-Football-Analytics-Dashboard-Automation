import { useState, useMemo } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";

// Define interfaces for our attribute objects
interface AttributeItem {
  key: string;
  label: string;
  calculated?: boolean; // Added optional calculated property
}

const PlayerComparison = () => {
  const { players, loading } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [attributeGroup, setAttributeGroup] = useState<string>("physical");

  // Get selected player objects
  const selectedPlayers = useMemo(() => {
    return players.filter(player => selectedPlayerIds.includes(player.id));
  }, [players, selectedPlayerIds]);

  // Handle player selection
  const handlePlayerSelection = (playerIds: number[]) => {
    setSelectedPlayerIds(playerIds);
  };

  // Handle removing a player from selection
  const handleRemovePlayer = (playerId: number) => {
    setSelectedPlayerIds(prev => prev.filter(id => id !== playerId));
  };

  // Format data for KPI comparison table
  const formatTableData = () => {
    const kpis: AttributeItem[] = [
      { key: 'distance', label: 'Total Distance (km)' },
      { key: 'sprintDistance', label: 'Sprint Distance (km)', calculated: true },
      { key: 'maxSpeed', label: 'Max Speed (km/h)', calculated: true },
      { key: 'passCompletion', label: 'Pass Completion %', calculated: true },
      { key: 'shots_on_target', label: 'Shots on Target' },
      { key: 'tackles_won', label: 'Tackles Won' }
    ];

    return kpis;
  };

  // Calculate derived metrics
  const calculateMetric = (player: Player, metric: string) => {
    switch(metric) {
      case 'sprintDistance':
        return (player.distance * 0.15).toFixed(1); // Simulated: 15% of total distance is sprint
      case 'maxSpeed':
        return (20 + Math.random() * 12).toFixed(1); // Simulated: Random max speed between 20-32 km/h
      case 'passCompletion':
        return player.passes_completed > 0 
          ? Math.round((player.passes_completed / player.passes_attempted) * 100) 
          : 0;
      default:
        return player[metric as keyof Player] || '0';
    }
  };

  // Format data for radar chart
  const formatRadarData = () => {
    const attributes: Record<string, AttributeItem[]> = {
      physical: [
        { key: 'distance', label: 'Distance' },
        { key: 'sprintDistance', label: 'Sprint Dist.', calculated: true },
        { key: 'maxSpeed', label: 'Max Speed', calculated: true },
        { key: 'stamina', label: 'Stamina', calculated: true }
      ],
      attacking: [
        { key: 'shots_total', label: 'Shots' },
        { key: 'shots_on_target', label: 'Shots on Target' },
        { key: 'passCompletion', label: 'Pass %', calculated: true },
        { key: 'keyPasses', label: 'Key Passes', calculated: true }
      ],
      defending: [
        { key: 'tackles_attempted', label: 'Tackles Attempted' },
        { key: 'tackles_won', label: 'Tackles Won' },
        { key: 'interceptions', label: 'Interceptions', calculated: true },
        { key: 'clearances', label: 'Clearances', calculated: true }
      ]
    };

    const selectedAttributes = attributes[attributeGroup] || [];
    
    return selectedAttributes.map(attr => {
      const dataPoint: any = { attribute: attr.label };
      
      selectedPlayers.forEach(player => {
        // For calculated metrics, generate sensible simulated values
        let value;
        
        if (attr.key === 'stamina') {
          value = Math.round(60 + Math.random() * 40); // 60-100 rating
        } else if (attr.key === 'keyPasses') {
          value = Math.round(player.passes_completed * 0.1); // 10% of completed passes are "key passes"
        } else if (attr.key === 'interceptions') {
          value = Math.round(player.tackles_won * 0.8); // 80% of successful tackles
        } else if (attr.key === 'clearances') {
          value = Math.round(player.tackles_attempted * 0.5); // 50% of tackle attempts
        } else {
          value = calculateMetric(player, attr.key);
        }
        
        dataPoint[`player${player.id}`] = value;
      });
      
      return dataPoint;
    });
  };

  // Generate colors for player data
  const getPlayerColor = (index: number) => {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']; // amber, emerald, blue, violet
    return colors[index % colors.length];
  };

  // Normalize radar chart data
  const normalizeData = (data: any[]) => {
    if (data.length === 0 || selectedPlayers.length === 0) return data;

    // For each attribute, find the max value across all players
    const maxValues: Record<string, number> = {};
    
    data.forEach(item => {
      const attributeName = item.attribute;
      let max = 0;
      
      selectedPlayers.forEach(player => {
        const value = parseFloat(item[`player${player.id}`]);
        if (!isNaN(value) && value > max) {
          max = value;
        }
      });
      
      maxValues[attributeName] = max;
    });

    // Normalize each value to be between 0-100
    return data.map(item => {
      const normalizedItem: any = { attribute: item.attribute };
      const max = maxValues[item.attribute] || 1; // Avoid division by zero
      
      selectedPlayers.forEach(player => {
        const key = `player${player.id}`;
        const value = parseFloat(item[key]);
        normalizedItem[key] = !isNaN(value) ? (value / max) * 100 : 0;
      });
      
      return normalizedItem;
    });
  };

  const tableKpis = formatTableData();
  const radarData = useMemo(() => normalizeData(formatRadarData()), [selectedPlayers, attributeGroup]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-club-gold mb-2">Player Comparison</h1>
        <p className="text-club-light-gray/70">Compare stats between multiple players</p>
      </div>

      {/* Player Selection */}
      <Card className="border-club-gold/20 bg-club-dark-gray mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-club-gold text-lg">Select Players to Compare</CardTitle>
          <CardDescription>Choose 2-4 players to compare their performance stats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MultiPlayerSelect 
              players={players}
              selectedPlayerIds={selectedPlayerIds}
              onChange={handlePlayerSelection}
              loading={loading}
              max={4}
            />
            
            {selectedPlayers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPlayers.map((player, index) => (
                  <Badge 
                    key={player.id}
                    className="bg-club-gold/20 text-club-gold hover:bg-club-gold/30 flex items-center gap-1 py-1.5"
                    style={{ borderLeft: `3px solid ${getPlayerColor(index)}` }}
                  >
                    {player.name}
                    <button 
                      onClick={() => handleRemovePlayer(player.id)}
                      className="ml-1 rounded-full hover:bg-club-gold/20 p-0.5"
                      aria-label={`Remove ${player.name}`}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPlayers.length >= 2 ? (
        <>
          {/* KPI Comparison Table */}
          <Card className="border-club-gold/20 bg-club-dark-gray mb-6">
            <CardHeader>
              <CardTitle className="text-club-gold text-lg">Performance Comparison</CardTitle>
              <CardDescription>Key metrics comparison between selected players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="[&_th]:text-club-gold [&_td]:text-club-light-gray [&_tr]:border-club-gold/20">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Metric</TableHead>
                      {selectedPlayers.map((player, index) => (
                        <TableHead key={player.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getPlayerColor(index) }}
                            ></div>
                            {player.name}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableKpis.map((kpi) => (
                      <TableRow key={kpi.key}>
                        <TableCell className="font-medium">{kpi.label}</TableCell>
                        {selectedPlayers.map((player) => (
                          <TableCell key={`${player.id}-${kpi.key}`}>
                            {calculateMetric(player, kpi.key)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart Comparison */}
          <Card className="border-club-gold/20 bg-club-dark-gray">
            <CardHeader className="pb-0">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-club-gold text-lg">Performance Radar</CardTitle>
                  <CardDescription>Visual comparison of player attributes</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-club-gold/30 text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold"
                    >
                      <Filter size={16} className="mr-2" />
                      {attributeGroup.charAt(0).toUpperCase() + attributeGroup.slice(1)} Attributes
                      <ChevronDown size={16} className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-club-dark-gray border-club-gold/30">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-club-light-gray focus:bg-club-gold/20 focus:text-club-gold"
                      onClick={() => setAttributeGroup('physical')}
                    >
                      {attributeGroup === 'physical' && <Check size={16} />}
                      <span className={attributeGroup === 'physical' ? 'ml-0' : 'ml-5'}>Physical</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-club-light-gray focus:bg-club-gold/20 focus:text-club-gold"
                      onClick={() => setAttributeGroup('attacking')}
                    >
                      {attributeGroup === 'attacking' && <Check size={16} />}
                      <span className={attributeGroup === 'attacking' ? 'ml-0' : 'ml-5'}>Attacking</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-club-light-gray focus:bg-club-gold/20 focus:text-club-gold"
                      onClick={() => setAttributeGroup('defending')}
                    >
                      {attributeGroup === 'defending' && <Check size={16} />}
                      <span className={attributeGroup === 'defending' ? 'ml-0' : 'ml-5'}>Defending</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ChartContainer 
                  config={{
                    ...selectedPlayers.reduce((acc, player, idx) => ({
                      ...acc,
                      [`player${player.id}`]: {
                        label: player.name,
                        color: getPlayerColor(idx),
                      }
                    }), {})
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 10, left: 20 }}>
                      <PolarGrid stroke="#4a4a4a" />
                      <PolarAngleAxis 
                        dataKey="attribute" 
                        tick={{ fill: "#d4d4d4", fontSize: 12 }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        stroke="#4a4a4a" 
                        tick={{ fill: "#d4d4d4" }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      
                      {selectedPlayers.map((player, idx) => (
                        <Radar 
                          key={player.id}
                          name={player.name}
                          dataKey={`player${player.id}`}
                          stroke={getPlayerColor(idx)}
                          fill={getPlayerColor(idx)}
                          fillOpacity={0.2}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                {selectedPlayers.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getPlayerColor(idx) }}
                    ></div>
                    <span className="text-club-light-gray">{player.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-club-gold/20 bg-club-dark-gray">
          <CardContent className="pt-6">
            <div className="text-center py-12 text-club-light-gray/70">
              <p>Please select at least 2 players to compare their stats.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerComparison;
