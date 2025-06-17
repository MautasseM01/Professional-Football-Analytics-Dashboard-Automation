
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchRating } from "@/hooks/use-match-ratings";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

interface SeasonPerformanceTrendsProps {
  ratings: MatchRating[];
}

export const SeasonPerformanceTrends = ({ ratings }: SeasonPerformanceTrendsProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No seasonal performance data available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort ratings by date for trend analysis
  const sortedRatings = [...ratings].sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());

  // Prepare data for trend charts
  const trendData = sortedRatings.map((rating, index) => ({
    match: index + 1,
    date: rating.match_date,
    opponent: rating.opponent,
    overall: rating.overall_performance,
    attacking: rating.attacking_rating,
    defensive: rating.defensive_rating,
    possession: rating.possession_rating,
    tactical: rating.tactical_execution,
    mental: rating.mental_strength,
    result: rating.result
  }));

  // Calculate moving averages (last 3 matches)
  const movingAverageData = trendData.map((data, index) => {
    const start = Math.max(0, index - 2);
    const recentMatches = trendData.slice(start, index + 1);
    const avgOverall = recentMatches.reduce((sum, m) => sum + m.overall, 0) / recentMatches.length;
    
    return {
      ...data,
      movingAverage: avgOverall
    };
  });

  // Calculate performance metrics
  const recentForm = sortedRatings.slice(-5);
  const earlySeasonForm = sortedRatings.slice(0, 5);
  
  const recentAvg = recentForm.reduce((sum, r) => sum + r.overall_performance, 0) / recentForm.length;
  const earlyAvg = earlySeasonForm.reduce((sum, r) => sum + r.overall_performance, 0) / earlySeasonForm.length;
  const formTrend = recentAvg - earlyAvg;

  // Best and worst performances
  const bestPerformance = sortedRatings.reduce((best, current) => 
    current.overall_performance > best.overall_performance ? current : best
  );
  const worstPerformance = sortedRatings.reduce((worst, current) => 
    current.overall_performance < worst.overall_performance ? current : worst
  );

  // Performance consistency (standard deviation)
  const mean = sortedRatings.reduce((sum, r) => sum + r.overall_performance, 0) / sortedRatings.length;
  const variance = sortedRatings.reduce((sum, r) => sum + Math.pow(r.overall_performance - mean, 2), 0) / sortedRatings.length;
  const consistency = 100 - (Math.sqrt(variance) * 10); // Convert to percentage

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">Match {label}</p>
          <p className="text-sm">vs {data.opponent}</p>
          <p className="text-sm">{new Date(data.date).toLocaleDateString()}</p>
          <p className="text-sm">Result: {data.result}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey === 'movingAverage' ? 'Moving Avg' : entry.dataKey}: {entry.value.toFixed(1)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${formTrend > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Form Trend</p>
                <p className={`text-lg font-bold ${formTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formTrend > 0 ? '+' : ''}{formTrend.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <p className="text-lg font-bold text-blue-500">{consistency.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Best Performance</p>
                <p className="text-lg font-bold text-green-500">{bestPerformance.overall_performance.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{bestPerformance.opponent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Worst Performance</p>
                <p className="text-lg font-bold text-red-500">{worstPerformance.overall_performance.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{worstPerformance.opponent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Overall Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movingAverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="match" 
                  tickFormatter={(value) => `M${value}`}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="overall" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Overall Rating"
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAverage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Moving Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multi-metric Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-metric Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="match" 
                  tickFormatter={(value) => `M${value}`}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="attacking" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Attacking"
                />
                <Area 
                  type="monotone" 
                  dataKey="defensive" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Defensive"
                />
                <Area 
                  type="monotone" 
                  dataKey="possession" 
                  stackId="3"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Possession"
                />
                <Area 
                  type="monotone" 
                  dataKey="tactical" 
                  stackId="4"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  name="Tactical"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Phases Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Phases Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Early Season</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Rating</span>
                  <span>{earlyAvg.toFixed(1)}</span>
                </div>
                <Progress value={earlyAvg * 10} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Based on first {earlySeasonForm.length} matches
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recent Form</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Rating</span>
                  <span>{recentAvg.toFixed(1)}</span>
                </div>
                <Progress value={recentAvg * 10} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Based on last {recentForm.length} matches
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Overall Season</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Rating</span>
                  <span>{mean.toFixed(1)}</span>
                </div>
                <Progress value={mean * 10} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Across {sortedRatings.length} matches
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Form Direction</span>
              <Badge variant={formTrend > 0 ? "default" : formTrend < -0.5 ? "destructive" : "secondary"}>
                {formTrend > 0.5 ? "Improving" : formTrend < -0.5 ? "Declining" : "Stable"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
