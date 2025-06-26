
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const BenchmarkDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('development');

  const benchmarkData = {
    development: [
      { 
        metric: 'Academy Progression Rate', 
        ourValue: 78, 
        leagueAverage: 65, 
        industryBest: 85,
        trend: 'up'
      },
      { 
        metric: 'First Team Integration', 
        ourValue: 45, 
        leagueAverage: 38, 
        industryBest: 52,
        trend: 'up'
      },
      { 
        metric: 'Technical Development Score', 
        ourValue: 82, 
        leagueAverage: 74, 
        industryBest: 89,
        trend: 'up'
      },
      { 
        metric: 'Injury Prevention Rate', 
        ourValue: 92, 
        leagueAverage: 87, 
        industryBest: 95,
        trend: 'stable'
      }
    ],
    financial: [
      { 
        metric: 'Development ROI', 
        ourValue: 156000, 
        leagueAverage: 89000, 
        industryBest: 230000,
        trend: 'up'
      },
      { 
        metric: 'Cost per Graduate', 
        ourValue: 45000, 
        leagueAverage: 62000, 
        industryBest: 38000,
        trend: 'down'
      },
      { 
        metric: 'Market Value Generated', 
        ourValue: 2100000, 
        leagueAverage: 1450000, 
        industryBest: 3200000,
        trend: 'up'
      }
    ],
    talent: [
      { 
        metric: 'Identification Success Rate', 
        ourValue: 73, 
        leagueAverage: 58, 
        industryBest: 81,
        trend: 'up'
      },
      { 
        metric: 'Scouting Efficiency', 
        ourValue: 68, 
        leagueAverage: 62, 
        industryBest: 76,
        trend: 'up'
      },
      { 
        metric: 'Player Retention Rate', 
        ourValue: 84, 
        leagueAverage: 79, 
        industryBest: 88,
        trend: 'stable'
      }
    ]
  };

  const trendData = [
    { month: 'Jul', us: 72, league: 65, industry: 75 },
    { month: 'Aug', us: 75, league: 66, industry: 76 },
    { month: 'Sep', us: 78, league: 67, industry: 77 },
    { month: 'Oct', us: 80, league: 68, industry: 78 },
    { month: 'Nov', us: 82, league: 69, industry: 79 },
    { month: 'Dec', us: 85, league: 70, industry: 80 }
  ];

  const getBenchmarkColor = (ourValue: number, leagueAverage: number, industryBest: number) => {
    if (ourValue >= industryBest * 0.95) return 'text-green-400';
    if (ourValue >= leagueAverage) return 'text-blue-400';
    return 'text-amber-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <BarChart3 className="mr-2 h-5 w-5" />
            Performance Benchmarking Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 bg-club-black/40">
              <TabsTrigger value="development" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                Development KPIs
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                Financial ROI
              </TabsTrigger>
              <TabsTrigger value="talent" className="data-[state=active]:bg-club-gold data-[state=active]:text-club-black">
                Talent ID
              </TabsTrigger>
            </TabsList>

            {Object.entries(benchmarkData).map(([category, metrics]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((metric, index) => (
                    <Card key={index} className="bg-club-black/40 border-club-gold/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-club-light-gray">{metric.metric}</h4>
                          {getTrendIcon(metric.trend)}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-club-light-gray/70">Our Performance</span>
                            <span className={`font-bold ${getBenchmarkColor(metric.ourValue, metric.leagueAverage, metric.industryBest)}`}>
                              {category === 'financial' ? `£${metric.ourValue.toLocaleString()}` : `${metric.ourValue}%`}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-club-light-gray/60">League Average</span>
                              <span>{category === 'financial' ? `£${metric.leagueAverage.toLocaleString()}` : `${metric.leagueAverage}%`}</span>
                            </div>
                            <Progress 
                              value={(metric.ourValue / metric.industryBest) * 100} 
                              className="h-2"
                            />
                            <div className="flex justify-between text-xs">
                              <span className="text-club-light-gray/60">Industry Best</span>
                              <span>{category === 'financial' ? `£${metric.industryBest.toLocaleString()}` : `${metric.industryBest}%`}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold">Performance Trends vs Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #D4AF37',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="us" stroke="#D4AF37" strokeWidth={3} name="Our Performance" />
                <Line type="monotone" dataKey="league" stroke="#60A5FA" strokeWidth={2} name="League Average" />
                <Line type="monotone" dataKey="industry" stroke="#34D399" strokeWidth={2} name="Industry Best" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
