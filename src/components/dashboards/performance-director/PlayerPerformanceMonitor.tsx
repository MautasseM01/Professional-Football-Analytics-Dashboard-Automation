
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Eye,
  Download,
  BarChart3,
  Activity,
  Target,
  Calendar
} from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { usePlayerData } from "@/hooks/use-player-data";
import { usePlayerInjuries } from "@/hooks/use-player-injuries";
import { Player } from "@/types";
import { PlayerPerformanceCharts } from "./PlayerPerformanceCharts";
import { PlayerComparisonTable } from "./PlayerComparisonTable";
import { cn } from "@/lib/utils";

interface PlayerWithExtras extends Player {
  developmentStage?: 'Academy' | 'U23s' | 'First Team';
  ageGroup?: 'U18' | 'U21' | 'Senior';
  watchList?: boolean;
  injuryRisk?: 'Low' | 'Medium' | 'High';
  marketValue?: number;
  developmentROI?: number;
}

export const PlayerPerformanceMonitor = () => {
  const { players, loading } = usePlayerData();
  const { data: injuries } = usePlayerInjuries();
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithExtras[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>("all");
  const [developmentStageFilter, setDevelopmentStageFilter] = useState<string>("all");
  const [injuryStatusFilter, setInjuryStatusFilter] = useState<string>("all");
  const [watchListOnly, setWatchListOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced player data with mock additional fields
  const enhancedPlayers = useMemo(() => {
    if (!players) return [];
    
    return players.map((player, index) => ({
      ...player,
      developmentStage: ['Academy', 'U23s', 'First Team'][index % 3] as PlayerWithExtras['developmentStage'],
      ageGroup: index < 5 ? 'U18' : index < 12 ? 'U21' : 'Senior' as PlayerWithExtras['ageGroup'],
      watchList: index % 4 === 0,
      injuryRisk: ['Low', 'Medium', 'High'][index % 3] as PlayerWithExtras['injuryRisk'],
      marketValue: Math.floor(Math.random() * 50000000) + 1000000,
      developmentROI: Math.floor(Math.random() * 300) + 50
    }));
  }, [players]);

  // Filter players based on search and filters
  const filteredPlayers = useMemo(() => {
    let filtered = enhancedPlayers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Position filter
    if (positionFilter !== "all") {
      filtered = filtered.filter(player => player.position === positionFilter);
    }

    // Age group filter
    if (ageGroupFilter !== "all") {
      filtered = filtered.filter(player => player.ageGroup === ageGroupFilter);
    }

    // Development stage filter
    if (developmentStageFilter !== "all") {
      filtered = filtered.filter(player => player.developmentStage === developmentStageFilter);
    }

    // Injury status filter
    if (injuryStatusFilter !== "all") {
      const playerInjuries = injuries?.filter(injury => injury.status === 'active') || [];
      if (injuryStatusFilter === "injured") {
        filtered = filtered.filter(player => 
          playerInjuries.some(injury => injury.player_id === player.id)
        );
      } else if (injuryStatusFilter === "available") {
        filtered = filtered.filter(player => 
          !playerInjuries.some(injury => injury.player_id === player.id)
        );
      }
    }

    // Watch list filter
    if (watchListOnly) {
      filtered = filtered.filter(player => player.watchList);
    }

    return filtered;
  }, [enhancedPlayers, searchQuery, positionFilter, ageGroupFilter, developmentStageFilter, injuryStatusFilter, watchListOnly, injuries]);

  const handlePlayerSelect = (player: PlayerWithExtras) => {
    if (selectedPlayers.length >= 4) {
      return; // Max 4 players
    }
    
    if (!selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handlePlayerRemove = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };

  const toggleWatchList = (playerId: number) => {
    // Mock functionality - would update database in real implementation
    console.log(`Toggle watch list for player ${playerId}`);
  };

  const exportData = () => {
    console.log("Exporting performance data...");
    // Mock export functionality
  };

  const getInjuryRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDevelopmentStageColor = (stage: string) => {
    switch (stage) {
      case 'First Team': return 'text-club-gold bg-club-gold/10 border-club-gold/30';
      case 'U23s': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Academy': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay isLoading={loading} message="Loading performance data..." />
      
      {/* Header with Search and Filters */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Users className="mr-2 h-5 w-5" />
            Player Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-club-light-gray/50 h-4 w-4" />
            <Input
              placeholder="Search players by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-club-black/40 border-club-gold/30 text-club-light-gray"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Forward">Forward</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
              <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="U18">U18</SelectItem>
                <SelectItem value="U21">U21</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>

            <Select value={developmentStageFilter} onValueChange={setDevelopmentStageFilter}>
              <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Academy">Academy</SelectItem>
                <SelectItem value="U23s">U23s</SelectItem>
                <SelectItem value="First Team">First Team</SelectItem>
              </SelectContent>
            </Select>

            <Select value={injuryStatusFilter} onValueChange={setInjuryStatusFilter}>
              <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="injured">Injured</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={watchListOnly ? "default" : "outline"}
              onClick={() => setWatchListOnly(!watchListOnly)}
              className={watchListOnly ? 'bg-club-gold text-club-black' : 'border-club-gold/30'}
            >
              <Eye className="mr-2 h-4 w-4" />
              Watch List
            </Button>
          </div>

          {/* Selected Players */}
          {selectedPlayers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-club-light-gray">
                Selected Players ({selectedPlayers.length}/4)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map(player => (
                  <Badge
                    key={player.id}
                    variant="secondary"
                    className="flex items-center gap-2 bg-club-gold/20 text-club-light-gray border-club-gold/30 px-3 py-1.5"
                  >
                    <PlayerAvatar player={player} size="xs" />
                    <span>{player.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-500/20"
                      onClick={() => handlePlayerRemove(player.id)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.map(player => (
          <Card 
            key={player.id}
            className={cn(
              "bg-club-dark-gray border-club-gold/20 hover:border-club-gold/40 transition-all cursor-pointer",
              selectedPlayers.find(p => p.id === player.id) && "ring-2 ring-club-gold/50"
            )}
            onClick={() => handlePlayerSelect(player)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <PlayerAvatar player={player} size="sm" />
                  <div>
                    <h4 className="font-medium text-club-light-gray">{player.name}</h4>
                    <p className="text-sm text-club-light-gray/70">{player.position}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {player.watchList && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-club-gold hover:bg-club-gold/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchList(player.id);
                      }}
                    >
                      <Star className="h-3 w-3 fill-current" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={getDevelopmentStageColor(player.developmentStage || '')}>
                    {player.developmentStage}
                  </Badge>
                  <Badge variant="outline" className={getInjuryRiskColor(player.injuryRisk || '')}>
                    {player.injuryRisk} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-club-light-gray/70">Market Value</span>
                    <p className="font-medium text-club-light-gray">
                      €{((player.marketValue || 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <span className="text-club-light-gray/70">Dev. ROI</span>
                    <p className="font-medium text-club-gold">
                      {player.developmentROI}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-club-light-gray">{player.matches || 0}</div>
                    <div className="text-club-light-gray/70">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-club-light-gray">{player.goals || 0}</div>
                    <div className="text-club-light-gray/70">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-club-light-gray">{player.assists || 0}</div>
                    <div className="text-club-light-gray/70">Assists</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Tabs */}
      {selectedPlayers.length > 0 && (
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-club-gold">Performance Analysis</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="border-club-gold/30"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-club-black/40">
                <TabsTrigger value="overview" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                  <Activity className="mr-2 h-4 w-4" />
                  Comparison
                </TabsTrigger>
                <TabsTrigger value="development" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                  <Target className="mr-2 h-4 w-4" />
                  Development
                </TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                  <Calendar className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <PlayerPerformanceCharts players={selectedPlayers} />
              </TabsContent>

              <TabsContent value="comparison" className="mt-6">
                <PlayerComparisonTable players={selectedPlayers} />
              </TabsContent>

              <TabsContent value="development" className="mt-6">
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-club-light-gray/30" />
                  <p className="mt-2 text-club-light-gray/70">Development tracking coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-club-light-gray/30" />
                  <p className="mt-2 text-club-light-gray/70">Timeline analysis coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
