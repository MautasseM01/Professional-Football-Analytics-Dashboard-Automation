
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
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-500';
    if (percentile >= 60) return 'text-club-gold';
    if (percentile >= 40) return 'text-orange-500';
    return 'text-red-500';
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
            className={viewType === 'percentile' ? 'bg-club-gold text-club-black' : ''}
          >
            Percentile Rankings
          </Button>
          <Button
            variant={viewType === 'comparison' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('comparison')}
            className={viewType === 'comparison' ? 'bg-club-gold text-club-black' : ''}
          >
            Position Comparison
          </Button>
          <Button
            variant={viewType === 'trends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('trends')}
            className={viewType === 'trends' ? 'bg-club-gold text-club-black' : ''}
          >
            Performance Radar
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overall Team Performance */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-club-gold">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Team Performance Overview
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(teamBenchmarks.overall.trend)}
              <Badge className="bg-club-gold/20 text-club-gold">
                {teamBenchmarks.overall.percentile}th percentile
              </Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-club-light-gray/70">
            Ranked #{teamBenchmarks.overall.rank} of {teamBenchmarks.overall.totalTeams} teams in the league
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamBenchmarks.categories.map((category) => (
              <div key={category.name} className="p-4 bg-club-black/40 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="font-medium text-club-light-gray">{category.name}</h3>
                  {getTrendIcon(category.trend)}
                </div>
                <div className={`text-2xl font-bold ${getPercentileColor(category.percentile)}`}>
                  {category.percentile}%
                </div>
                <div className="text-sm text-club-light-gray/70">
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
            <Card key={position.position} className="bg-club-dark-gray border-club-gold/20">
              <CardHeader>
                <CardTitle className="text-club-gold">{position.position} Performance</CardTitle>
                <CardDescription className="text-club-light-gray/70">
                  vs League Average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {position.metrics.map((metric) => (
                    <div key={metric.name} className="p-3 bg-club-black/40 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-club-light-gray">{metric.name}</span>
                        <Badge className={`${getPercentileColor(metric.percentile)} bg-transparent border`}>
                          {metric.percentile}th %ile
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-club-gold font-medium">{metric.value}</span>
                          <span className="text-club-light-gray/50 ml-2">Our Team</span>
                        </div>
                        <div>
                          <span className="text-club-light-gray/70">{metric.league}</span>
                          <span className="text-club-light-gray/50 ml-2">League Avg</span>
                        </div>
                      </div>

                      <div className="mt-2 w-full bg-club-black/60 rounded-full h-2">
                        <div 
                          className="bg-club-gold h-2 rounded-full transition-all duration-300"
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
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="text-club-gold">Performance Radar - Team vs League</CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Comprehensive performance comparison across key areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="attribute" className="text-club-light-gray" fontSize={12} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <Radar 
                    name="Our Team" 
                    dataKey="team" 
                    stroke="#D97706" 
                    fill="#D97706" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="League Average" 
                    dataKey="league" 
                    stroke="#6B7280" 
                    fill="#6B7280" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #D97706', 
                      borderRadius: '8px',
                      color: '#F3F4F6'
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
