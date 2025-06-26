
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { BarChart3, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { Player } from "@/types";
import { cn } from "@/lib/utils";

interface PlayerComparisonTableProps {
  players: Player[];
}

interface ComparisonMetric {
  key: string;
  label: string;
  getValue: (player: Player) => number;
  format: (value: number) => string;
  benchmarkType: 'higher' | 'lower'; // higher is better or lower is better
  unit?: string;
}

export const PlayerComparisonTable = ({ players }: PlayerComparisonTableProps) => {
  const metrics: ComparisonMetric[] = [
    {
      key: 'goals',
      label: 'Goals',
      getValue: (player) => player.goals || 0,
      format: (value) => value.toString(),
      benchmarkType: 'higher'
    },
    {
      key: 'assists',
      label: 'Assists',
      getValue: (player) => player.assists || 0,
      format: (value) => value.toString(),
      benchmarkType: 'higher'
    },
    {
      key: 'passAccuracy',
      label: 'Pass Accuracy',
      getValue: (player) => player.passes_attempted ? 
        (player.passes_completed || 0) / player.passes_attempted * 100 : 0,
      format: (value) => `${value.toFixed(1)}%`,
      benchmarkType: 'higher',
      unit: '%'
    },
    {
      key: 'shotsOnTarget',
      label: 'Shots on Target',
      getValue: (player) => player.shots_on_target || 0,
      format: (value) => value.toString(),
      benchmarkType: 'higher'
    },
    {
      key: 'tackleSuccess',
      label: 'Tackle Success',
      getValue: (player) => player.tackles_attempted ? 
        (player.tackles_won || 0) / player.tackles_attempted * 100 : 0,
      format: (value) => `${value.toFixed(1)}%`,
      benchmarkType: 'higher',
      unit: '%'
    },
    {
      key: 'distance',
      label: 'Distance (km)',
      getValue: (player) => player.distance || 0,
      format: (value) => `${value.toFixed(1)}`,
      benchmarkType: 'higher',
      unit: 'km'
    },
    {
      key: 'maxSpeed',
      label: 'Max Speed',
      getValue: (player) => player.maxSpeed || 0,
      format: (value) => `${value.toFixed(1)}`,
      benchmarkType: 'higher',
      unit: 'km/h'
    }
  ];

  // Calculate benchmarks and percentiles
  const benchmarkData = useMemo(() => {
    return metrics.map(metric => {
      const values = players.map(metric.getValue);
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // Mock league averages (would come from database in real implementation)
      const leagueAverage = avg * (0.8 + Math.random() * 0.4); // Random but realistic
      const positionAverage = avg * (0.9 + Math.random() * 0.2);
      
      return {
        ...metric,
        teamMax: max,
        teamMin: min,
        teamAvg: avg,
        leagueAverage,
        positionAverage,
        values
      };
    });
  }, [players, metrics]);

  // Calculate percentiles for each player
  const getPercentile = (value: number, allValues: number[], benchmarkType: 'higher' | 'lower') => {
    const sorted = [...allValues].sort((a, b) => a - b);
    const index = sorted.indexOf(value);
    const percentile = (index / (sorted.length - 1)) * 100;
    return benchmarkType === 'higher' ? percentile : 100 - percentile;
  };

  const getTrendIcon = (current: number, benchmark: number, benchmarkType: 'higher' | 'lower') => {
    const isGood = benchmarkType === 'higher' ? current > benchmark : current < benchmark;
    const diff = Math.abs(current - benchmark);
    const threshold = benchmark * 0.1; // 10% threshold
    
    if (diff < threshold) {
      return <Minus className="h-4 w-4 text-yellow-500" />;
    }
    
    return isGood ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getPerformanceColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-500 bg-green-500/10';
    if (percentile >= 60) return 'text-blue-500 bg-blue-500/10';
    if (percentile >= 40) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison Table */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <BarChart3 className="mr-2 h-5 w-5" />
            Detailed Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-gold/20">
                  <th className="text-left p-3 text-club-light-gray font-medium">Player</th>
                  {benchmarkData.map(metric => (
                    <th key={metric.key} className="text-center p-3 text-club-light-gray font-medium min-w-[120px]">
                      {metric.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((player, playerIndex) => (
                  <tr key={player.id} className="border-b border-club-gold/10 hover:bg-club-black/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar player={player} size="sm" />
                        <div>
                          <p className="font-medium text-club-light-gray">{player.name}</p>
                          <p className="text-sm text-club-light-gray/70">{player.position}</p>
                        </div>
                      </div>
                    </td>
                    {benchmarkData.map(metric => {
                      const value = metric.getValue(player);
                      const percentile = getPercentile(value, metric.values, metric.benchmarkType);
                      const isTeamBest = value === metric.teamMax && metric.benchmarkType === 'higher';
                      
                      return (
                        <td key={`${player.id}-${metric.key}`} className="p-3 text-center">
                          <div className="space-y-2">
                            <div className={cn(
                              "font-medium",
                              isTeamBest ? "text-club-gold" : "text-club-light-gray"
                            )}>
                              {metric.format(value)}
                              {isTeamBest && <span className="ml-1 text-xs">👑</span>}
                            </div>
                            
                            <Badge className={cn("text-xs", getPerformanceColor(percentile))}>
                              {percentile.toFixed(0)}th percentile
                            </Badge>
                            
                            <div className="flex items-center justify-center gap-1">
                              {getTrendIcon(value, metric.leagueAverage, metric.benchmarkType)}
                              <span className="text-xs text-club-light-gray/70">vs League</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <Target className="mr-2 h-5 w-5" />
              League Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benchmarkData.slice(0, 4).map(metric => (
              <div key={metric.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/70">{metric.label}</span>
                  <span className="text-sm text-club-gold">
                    League Avg: {metric.format(metric.leagueAverage)}
                  </span>
                </div>
                <div className="space-y-1">
                  {players.map(player => {
                    const value = metric.getValue(player);
                    const progress = (value / Math.max(metric.leagueAverage * 1.5, metric.teamMax)) * 100;
                    const isAboveAverage = metric.benchmarkType === 'higher' ? 
                      value > metric.leagueAverage : value < metric.leagueAverage;
                    
                    return (
                      <div key={player.id} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-club-light-gray/70 truncate">
                          {player.name?.split(' ').pop()}
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={progress} 
                            className={cn(
                              "h-2",
                              isAboveAverage ? "text-green-500" : "text-red-500"
                            )}
                          />
                        </div>
                        <div className="w-12 text-xs text-club-light-gray text-right">
                          {metric.format(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <TrendingUp className="mr-2 h-5 w-5" />
              Position Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benchmarkData.slice(4).map(metric => (
              <div key={metric.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-club-light-gray/70">{metric.label}</span>
                  <span className="text-sm text-club-gold">
                    Position Avg: {metric.format(metric.positionAverage)}
                  </span>
                </div>
                <div className="space-y-1">
                  {players.map(player => {
                    const value = metric.getValue(player);
                    const progress = (value / Math.max(metric.positionAverage * 1.5, metric.teamMax)) * 100;
                    const isAboveAverage = metric.benchmarkType === 'higher' ? 
                      value > metric.positionAverage : value < metric.positionAverage;
                    
                    return (
                      <div key={player.id} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-club-light-gray/70 truncate">
                          {player.name?.split(' ').pop()}
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={progress} 
                            className={cn(
                              "h-2",
                              isAboveAverage ? "text-green-500" : "text-red-500"
                            )}
                          />
                        </div>
                        <div className="w-12 text-xs text-club-light-gray text-right">
                          {metric.format(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Market Value & ROI Analysis */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold">Market Value & Development ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {players.map(player => {
              const marketValue = Math.floor(Math.random() * 50000000) + 1000000;
              const developmentROI = Math.floor(Math.random() * 300) + 50;
              const valueGrowth = Math.floor(Math.random() * 40) - 20; // -20% to +20%
              
              return (
                <div key={player.id} className="p-4 bg-club-black/40 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={player} size="sm" />
                    <div>
                      <p className="font-medium text-club-light-gray">{player.name}</p>
                      <p className="text-xs text-club-light-gray/70">{player.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-club-light-gray/70">Market Value</span>
                      <span className="text-sm font-medium text-club-gold">
                        €{(marketValue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-club-light-gray/70">Dev. ROI</span>
                      <span className="text-sm font-medium text-green-400">
                        {developmentROI}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-club-light-gray/70">12m Growth</span>
                      <div className="flex items-center gap-1">
                        {valueGrowth >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          valueGrowth >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {valueGrowth > 0 ? '+' : ''}{valueGrowth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
