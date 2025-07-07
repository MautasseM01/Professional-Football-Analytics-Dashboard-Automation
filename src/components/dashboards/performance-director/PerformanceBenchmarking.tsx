
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Download, Filter } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { usePlayerData } from "@/hooks/use-player-data";

export const PerformanceBenchmarking = () => {
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [viewType, setViewType] = useState<'percentile' | 'comparison' | 'trends'>('percentile');
  const { players } = usePlayerData();

  // Mock benchmarking data - in real app, this would come from league/club comparisons
  const teamBenchmarks = {
    overall: {
      percentile: 78,
      rank: 3,
      totalTeams: 20,
      trend: 'improving'
    },
    categories: [
      { name: 'Attacking', percentile: 85, rank: 2, trend: 'stable' },
      { name: 'Defending', percentile: 72, rank: 5, trend: 'improving' },
      { name: 'Midfield', percentile: 80, rank: 3, trend: 'improving' },
      { name: 'Physical', percentile: 75, rank: 4, trend: 'declining' }
    ]
  };

  const positionBenchmarks = [
    {
      position: 'Goalkeeper',
      metrics: [
        { name: 'Save %', value: 78, league: 72, percentile: 85 },
        { name: 'Clean Sheets', value: 12, league: 8, percentile: 92 },
        { name: 'Distribution', value: 82, league: 75, percentile: 78 }
      ]
    },
    {
      position: 'Defender',
      metrics: [
        { name: 'Tackles/Game', value: 4.2, league: 3.8, percentile: 75 },
        { name: 'Interceptions', value: 2.1, league: 2.5, percentile: 45 },
        { name: 'Aerial Duels', value: 68, league: 62, percentile: 82 }
      ]
    },
    {
      position: 'Midfielder',
      metrics: [
        { name: 'Pass %', value: 89, league: 85, percentile: 78 },
        { name: 'Key Passes', value: 2.8, league: 2.2, percentile: 88 },
        { name: 'Distance Covered', value: 11.2, league: 10.8, percentile: 65 }
      ]
    },
    {
      position: 'Forward',
      metrics: [
        { name: 'Goals/Game', value: 0.65, league: 0.45, percentile: 85 },
        { name: 'Shots on Target', value: 68, league: 62, percentile: 78 },
        { name: 'Conversion Rate', value: 18, league: 14, percentile: 82 }
      ]
    }
  ];

  const radarData = [
    { attribute: 'Attacking', team: 85, league: 70 },
    { attribute: 'Defending', team: 72, league: 75 },
    { attribute: 'Midfield', team: 80, league: 68 },
    { attribute: 'Physical', team: 75, league: 72 },
    { attribute: 'Technical', team: 82, league: 70 },
    { attribute: 'Mental', team: 78, league: 73 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4 bg-muted rounded-full" />;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-emerald-500';
    if (percentile >= 60) return 'text-primary';
    if (percentile >= 40) return 'text-orange-500';
    return 'text-destructive';
  };

  const exportToPDF = () => {
    // Mock export functionality
    console.log('Exporting performance benchmarks to PDF...');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewType === 'percentile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('percentile')}
            className={viewType === 'percentile' ? 'bg-primary text-primary-foreground min-h-[var(--touch-target-min)]' : 'border-border hover:bg-muted min-h-[var(--touch-target-min)]'}
          >
            Percentile Rankings
          </Button>
          <Button
            variant={viewType === 'comparison' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('comparison')}
            className={viewType === 'comparison' ? 'bg-primary text-primary-foreground min-h-[var(--touch-target-min)]' : 'border-border hover:bg-muted min-h-[var(--touch-target-min)]'}
          >
            Position Comparison
          </Button>
          <Button
            variant={viewType === 'trends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('trends')}
            className={viewType === 'trends' ? 'bg-primary text-primary-foreground min-h-[var(--touch-target-min)]' : 'border-border hover:bg-muted min-h-[var(--touch-target-min)]'}
          >
            Performance Radar
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          className="flex items-center gap-2 border-border hover:bg-muted min-h-[var(--touch-target-min)]"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Team Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-primary">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Team Performance Overview
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(teamBenchmarks.overall.trend)}
              <Badge className="bg-primary/20 text-primary">
                {teamBenchmarks.overall.percentile}th percentile
              </Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ranked #{teamBenchmarks.overall.rank} of {teamBenchmarks.overall.totalTeams} teams in the league
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamBenchmarks.categories.map((category) => (
              <div key={category.name} className="p-4 bg-muted/40 rounded-lg text-center min-h-[var(--touch-target-min)]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                  {getTrendIcon(category.trend)}
                </div>
                <div className={`text-2xl font-bold ${getPercentileColor(category.percentile)}`}>
                  {category.percentile}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Rank #{category.rank}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Position-Specific Analysis */}
      {viewType === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {positionBenchmarks.map((position) => (
            <Card key={position.position} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary">{position.position} Performance</CardTitle>
                <CardDescription className="text-muted-foreground">
                  vs League Average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {position.metrics.map((metric) => (
                    <div key={metric.name} className="p-3 bg-muted/40 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-foreground">{metric.name}</span>
                        <Badge className={`${getPercentileColor(metric.percentile)} bg-transparent border`}>
                          {metric.percentile}th %ile
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-primary font-medium">{metric.value}</span>
                          <span className="text-muted-foreground/70 ml-2">Our Team</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{metric.league}</span>
                          <span className="text-muted-foreground/70 ml-2">League Avg</span>
                        </div>
                      </div>

                      <div className="mt-2 w-full bg-muted/60 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${metric.percentile}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Radar */}
      {viewType === 'trends' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary">Performance Radar - Team vs League</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comprehensive performance comparison across key areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="attribute" className="text-foreground" fontSize={12} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Radar 
                    name="Our Team" 
                    dataKey="team" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="League Average" 
                    dataKey="league" 
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted-foreground))" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
