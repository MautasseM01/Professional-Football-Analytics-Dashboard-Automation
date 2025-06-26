
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from "recharts";
import { TrendingUp, Activity, Target, Zap } from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Player } from "@/types";

interface PlayerPerformanceChartsProps {
  players: Player[];
}

export const PlayerPerformanceCharts = ({ players }: PlayerPerformanceChartsProps) => {
  // Position-specific KPIs
  const getPositionSpecificMetrics = (player: Player) => {
    const baseMetrics = {
      name: player.name,
      playerId: player.id,
      position: player.position
    };

    switch (player.position) {
      case 'Goalkeeper':
        return {
          ...baseMetrics,
          shotStopping: Math.floor(Math.random() * 40) + 60,
          distribution: Math.floor(Math.random() * 30) + 70,
          positioning: Math.floor(Math.random() * 25) + 75,
          aerialAbility: Math.floor(Math.random() * 35) + 65,
          reflexes: Math.floor(Math.random() * 30) + 70,
          communication: Math.floor(Math.random() * 40) + 60
        };
      case 'Defender':
        return {
          ...baseMetrics,
          defending: (player.tackles_won || 0) * 10 + 50,
          aerialDuels: Math.floor(Math.random() * 30) + 70,
          positioning: Math.floor(Math.random() * 25) + 75,
          passing: ((player.passes_completed || 0) / Math.max(player.passes_attempted || 1, 1)) * 100,
          physicality: Math.floor(Math.random() * 35) + 65,
          leadership: Math.floor(Math.random() * 40) + 60
        };
      case 'Midfielder':
        return {
          ...baseMetrics,
          passing: ((player.passes_completed || 0) / Math.max(player.passes_attempted || 1, 1)) * 100,
          vision: Math.floor(Math.random() * 30) + 70,
          workRate: Math.floor(Math.random() * 35) + 65,
          creativity: (player.assists || 0) * 15 + 60,
          ballRecovery: (player.tackles_won || 0) * 12 + 50,
          technique: Math.floor(Math.random() * 25) + 75
        };
      case 'Forward':
        return {
          ...baseMetrics,
          finishing: (player.goals || 0) * 10 + 50,
          movement: Math.floor(Math.random() * 30) + 70,
          pace: Math.floor(Math.random() * 35) + 65,
          creativity: (player.assists || 0) * 15 + 60,
          physicality: Math.floor(Math.random() * 25) + 75,
          mentality: Math.floor(Math.random() * 40) + 60
        };
      default:
        return {
          ...baseMetrics,
          technical: Math.floor(Math.random() * 30) + 70,
          physical: Math.floor(Math.random() * 30) + 70,
          mental: Math.floor(Math.random() * 30) + 70,
          tactical: Math.floor(Math.random() * 30) + 70
        };
    }
  };

  // Enhanced radar chart data
  const radarData = useMemo(() => {
    const metrics = players.map(getPositionSpecificMetrics);
    if (metrics.length === 0) return [];

    const firstPlayer = metrics[0];
    const attributes = Object.keys(firstPlayer).filter(key => 
      !['name', 'playerId', 'position'].includes(key)
    );

    return attributes.map(attr => {
      const dataPoint: any = { attribute: attr };
      metrics.forEach((player, index) => {
        dataPoint[`player${index}`] = player[attr as keyof typeof player] || 0;
        dataPoint[`playerName${index}`] = player.name;
      });
      return dataPoint;
    });
  }, [players]);

  // Performance timeline data (mock)
  const timelineData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const dataPoint: any = { month };
      players.forEach((player, index) => {
        dataPoint[`player${index}`] = Math.floor(Math.random() * 30) + 70;
        dataPoint[`playerName${index}`] = player.name;
      });
      return dataPoint;
    });
  }, [players]);

  // Training vs Match performance correlation
  const correlationData = useMemo(() => {
    return players.map(player => ({
      name: player.name,
      trainingPerformance: Math.floor(Math.random() * 40) + 60,
      matchPerformance: (player.match_rating || 0) * 10 + Math.floor(Math.random() * 20),
      workload: Math.floor(Math.random() * 50) + 50
    }));
  }, [players]);

  const colors = ['#D4AF37', '#4F46E5', '#EF4444', '#10B981'];

  return (
    <div className="space-y-6">
      {/* Position-Specific Radar Chart */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Target className="mr-2 h-5 w-5" />
            Position-Specific Performance Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <ChartContainer
                config={{
                  player0: { label: players[0]?.name || "Player 1", color: colors[0] },
                  player1: { label: players[1]?.name || "Player 2", color: colors[1] },
                  player2: { label: players[2]?.name || "Player 3", color: colors[2] },
                  player3: { label: players[3]?.name || "Player 4", color: colors[3] }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#D4AF37" strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: '#E5E7EB', fontSize: 12 }} />
                    <PolarRadiusAxis 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      tickCount={5}
                    />
                    {players.map((player, index) => (
                      <Radar
                        key={player.id}
                        name={player.name}
                        dataKey={`player${index}`}
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-club-light-gray">Selected Players</h4>
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-club-black/40 rounded-lg">
                  <PlayerAvatar player={player} size="sm" />
                  <div className="flex-1">
                    <p className="font-medium text-club-light-gray">{player.name}</p>
                    <p className="text-sm text-club-light-gray/70">{player.position}</p>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Timeline */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <TrendingUp className="mr-2 h-5 w-5" />
            Performance Timeline (Season Progress)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                player0: { label: players[0]?.name || "Player 1", color: colors[0] },
                player1: { label: players[1]?.name || "Player 2", color: colors[1] },
                player2: { label: players[2]?.name || "Player 3", color: colors[2] },
                player3: { label: players[3]?.name || "Player 4", color: colors[3] }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#E5E7EB', fontSize: 12 }}
                    axisLine={{ stroke: '#D4AF37', strokeOpacity: 0.3 }}
                  />
                  <YAxis 
                    domain={[50, 100]}
                    tick={{ fill: '#E5E7EB', fontSize: 12 }}
                    axisLine={{ stroke: '#D4AF37', strokeOpacity: 0.3 }}
                  />
                  {players.map((player, index) => (
                    <Line
                      key={player.id}
                      type="monotone"
                      dataKey={`player${index}`}
                      stroke={colors[index]}
                      strokeWidth={3}
                      dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
                    />
                  ))}
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Training vs Match Performance Correlation */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Activity className="mr-2 h-5 w-5" />
            Training vs Match Performance Correlation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                trainingPerformance: { label: "Training Performance", color: colors[0] },
                matchPerformance: { label: "Match Performance", color: colors[1] }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" strokeOpacity={0.2} />
                  <XAxis 
                    type="number"
                    dataKey="trainingPerformance"
                    name="Training Performance"
                    domain={[50, 100]}
                    tick={{ fill: '#E5E7EB', fontSize: 12 }}
                    axisLine={{ stroke: '#D4AF37', strokeOpacity: 0.3 }}
                  />
                  <YAxis 
                    type="number"
                    dataKey="matchPerformance"
                    name="Match Performance"
                    domain={[50, 100]}
                    tick={{ fill: '#E5E7EB', fontSize: 12 }}
                    axisLine={{ stroke: '#D4AF37', strokeOpacity: 0.3 }}
                  />
                  <Scatter 
                    dataKey="matchPerformance" 
                    fill={colors[0]}
                    r={8}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-club-black/90 p-3 rounded-lg border border-club-gold/20">
                            <p className="text-club-gold font-medium">{data.name}</p>
                            <p className="text-club-light-gray text-sm">
                              Training: {data.trainingPerformance}
                            </p>
                            <p className="text-club-light-gray text-sm">
                              Match: {data.matchPerformance.toFixed(1)}
                            </p>
                            <p className="text-club-light-gray text-sm">
                              Workload: {data.workload}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mental/Psychological Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {players.map((player, index) => (
          <Card key={player.id} className="bg-club-dark-gray border-club-gold/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <PlayerAvatar player={player} size="sm" />
                <div>
                  <h4 className="font-medium text-club-light-gray">{player.name}</h4>
                  <p className="text-sm text-club-light-gray/70">Mental State</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/70">Confidence</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {Math.floor(Math.random() * 30) + 70}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/70">Focus</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {Math.floor(Math.random() * 25) + 75}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/70">Pressure Handling</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    {Math.floor(Math.random() * 35) + 65}%
                  </Badge>
                </div>
                
                <div className="pt-2 border-t border-club-gold/20">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-club-gold" />
                    <span className="text-sm text-club-light-gray">
                      Injury Risk: <span className="text-club-gold">Low</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
