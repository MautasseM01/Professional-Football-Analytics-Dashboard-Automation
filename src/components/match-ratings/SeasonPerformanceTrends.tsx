
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchRating } from "@/hooks/use-match-ratings";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Calendar, BarChart } from "lucide-react";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

interface SeasonPerformanceTrendsProps {
  ratings: MatchRating[];
}

export const SeasonPerformanceTrends = ({ ratings }: SeasonPerformanceTrendsProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No season trend data available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort ratings by date
  const sortedRatings = [...ratings].sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());

  // Create trend data with match numbers
  const trendData = sortedRatings.map((rating, index) => ({
    match: index + 1,
    date: rating.match_date,
    overall: rating.overall_performance,
    attacking: rating.attacking_rating,
    defensive: rating.defensive_rating,
    possession: rating.possession_rating,
    tactical: rating.tactical_execution,
    physical: rating.physical_performance,
    mental: rating.mental_strength,
    opponent: rating.opponent,
    result: rating.result
  }));

  // Calculate rolling averages (5-match window)
  const rollingData = trendData.map((_, index) => {
    const window = Math.min(5, index + 1);
    const start = Math.max(0, index - window + 1);
    const subset = trendData.slice(start, index + 1);
    
    return {
      match: index + 1,
      date: trendData[index].date,
      rollingOverall: subset.reduce((sum, r) => sum + r.overall, 0) / subset.length,
      rollingAttacking: subset.reduce((sum, r) => sum + r.attacking, 0) / subset.length,
      rollingDefensive: subset.reduce((sum, r) => sum + r.defensive, 0) / subset.length,
      rollingTactical: subset.reduce((sum, r) => sum + r.tactical, 0) / subset.length,
      opponent: trendData[index].opponent,
      result: trendData[index].result
    };
  });

  // Monthly performance aggregation
  const monthlyData = trendData.reduce((acc, rating) => {
    const month = new Date(rating.date).toISOString().substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = {
        month,
        matches: 0,
        totalOverall: 0,
        totalAttacking: 0,
        totalDefensive: 0,
        wins: 0,
        draws: 0,
        losses: 0
      };
    }
    
    acc[month].matches += 1;
    acc[month].totalOverall += rating.overall;
    acc[month].totalAttacking += rating.attacking;
    acc[month].totalDefensive += rating.defensive;
    
    if (rating.result.includes('W')) acc[month].wins += 1;
    else if (rating.result.includes('D')) acc[month].draws += 1;
    else acc[month].losses += 1;
    
    return acc;
  }, {} as Record<string, any>);

  const monthlyChartData = Object.values(monthlyData).map((data: any) => ({
    month: data.month,
    avgOverall: data.totalOverall / data.matches,
    avgAttacking: data.totalAttacking / data.matches,
    avgDefensive: data.totalDefensive / data.matches,
    matches: data.matches,
    winRate: (data.wins / data.matches) * 100
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded-lg shadow-lg">
          <p className="font-medium">Match {label}</p>
          {data.opponent && <p className="text-sm">vs {data.opponent}</p>}
          {data.result && <p className="text-sm">Result: {data.result}</p>}
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Season Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="overall" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Overall Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <ResponsiveGrid minCardWidth="400px">
        {/* Rolling Averages */}
        <Card>
          <CardHeader>
            <CardTitle>5-Match Rolling Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rollingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="rollingOverall" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Overall"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rollingAttacking" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Attacking"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rollingDefensive" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Defensive"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="tactical" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Tactical"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="physical" 
                    stackId="1"
                    stroke="#f97316" 
                    fill="#f97316"
                    fillOpacity={0.6}
                    name="Physical"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mental" 
                    stackId="1"
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.6}
                    name="Mental"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: any, name) => [value.toFixed(1), name]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgOverall" 
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Avg Overall"
                />
                <Area 
                  type="monotone" 
                  dataKey="avgAttacking" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Avg Attacking"
                />
                <Area 
                  type="monotone" 
                  dataKey="avgDefensive" 
                  stroke="#f59e0b" 
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  name="Avg Defensive"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Season Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Best Performance</div>
              <div className="text-2xl font-bold text-green-500">
                {Math.max(...trendData.map(d => d.overall)).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                overall rating
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Worst Performance</div>
              <div className="text-2xl font-bold text-red-500">
                {Math.min(...trendData.map(d => d.overall)).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                overall rating
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Current Form</div>
              <div className="text-2xl font-bold">
                {rollingData.length > 0 ? rollingData[rollingData.length - 1].rollingOverall.toFixed(1) : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                5-match average
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Improvement Trend</div>
              <div className={`text-2xl font-bold ${
                trendData.length > 1 && 
                trendData[trendData.length - 1].overall > trendData[0].overall 
                  ? 'text-green-500' : 'text-red-500'
              }`}>
                {trendData.length > 1 
                  ? (trendData[trendData.length - 1].overall - trendData[0].overall > 0 ? '+' : '') +
                    (trendData[trendData.length - 1].overall - trendData[0].overall).toFixed(1)
                  : 'N/A'
                }
              </div>
              <div className="text-xs text-muted-foreground">
                vs season start
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
