
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Player } from "@/types";
import { TrendingUp, BarChart3 } from "lucide-react";

interface PerformanceTrendsCardProps {
  player: Player;
}

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedMetric, setSelectedMetric] = useState("goals");
  const [timePeriod, setTimePeriod] = useState("last10");
  const [chartView, setChartView] = useState("line");
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);

  // All available metrics from the images
  const metrics = [
    { value: "goals", label: "Goals", dataKey: "goals" },
    { value: "assists", label: "Assists", dataKey: "assists" },
    { value: "passes_completed", label: "Passes Completed", dataKey: "passesCompleted" },
    { value: "distance", label: "Distance", dataKey: "distance" },
    { value: "sprint_distance", label: "Sprint Distance", dataKey: "sprintDistance" },
    { value: "shots_on_target", label: "Shots on Target", dataKey: "shotsOnTarget" },
    { value: "tackles_won", label: "Tackles Won", dataKey: "tacklesWon" },
    { value: "match_rating", label: "Match Rating", dataKey: "matchRating" }
  ];

  const timePeriods = [
    { value: "last5", label: "Last 5 Matches" },
    { value: "last10", label: "Last 10 Matches" },
    { value: "month", label: "This Month" },
    { value: "season", label: "This Season" }
  ];

  const chartViews = [
    { value: "line", label: "Line Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "area", label: "Area Chart" }
  ];

  // Generate realistic performance data based on the selected metric and player stats
  const generatePerformanceData = () => {
    const baseData = [];
    const matchCount = timePeriod === "last5" ? 5 : timePeriod === "last10" ? 10 : 15;
    
    for (let i = 0; i < matchCount; i++) {
      const match = matchCount - i;
      let value = 0;
      
      // Generate realistic values based on metric type and player's overall stats
      switch (selectedMetric) {
        case "goals":
          value = Math.floor(Math.random() * 3); // 0-2 goals per match
          break;
        case "assists":
          value = Math.floor(Math.random() * 2); // 0-1 assists per match
          break;
        case "passes_completed":
          const completionRate = player.passes_completed / player.passes_attempted;
          const baseAttempts = 40 + Math.random() * 30;
          value = Math.floor(baseAttempts * (completionRate + (Math.random() - 0.5) * 0.1));
          break;
        case "distance":
          value = parseFloat((player.distance + (Math.random() - 0.5) * 2).toFixed(1));
          break;
        case "sprint_distance":
          value = parseFloat(((player.sprintDistance || 2.5) + (Math.random() - 0.5) * 1).toFixed(1));
          break;
        case "shots_on_target":
          value = Math.floor(Math.random() * 4); // 0-3 shots on target
          break;
        case "tackles_won":
          const tackleRate = player.tackles_won / player.tackles_attempted;
          const baseTackles = 2 + Math.random() * 6;
          value = Math.floor(baseTackles * (tackleRate + (Math.random() - 0.5) * 0.1));
          break;
        case "match_rating":
          value = parseFloat((6.5 + Math.random() * 2.5).toFixed(1)); // 6.5-9.0 rating
          break;
        default:
          value = Math.random() * 10;
      }
      
      baseData.push({
        match: `Match ${match}`,
        [metrics.find(m => m.value === selectedMetric)?.dataKey || "value"]: Math.max(0, value),
        goals: Math.floor(Math.random() * 3),
        assists: Math.floor(Math.random() * 2),
        passesCompleted: 40 + Math.floor(Math.random() * 30),
        distance: parseFloat((10 + Math.random() * 3).toFixed(1)),
        sprintDistance: parseFloat((2 + Math.random() * 2).toFixed(1)),
        shotsOnTarget: Math.floor(Math.random() * 4),
        tacklesWon: Math.floor(Math.random() * 6),
        matchRating: parseFloat((6.5 + Math.random() * 2.5).toFixed(1))
      });
    }
    
    return baseData;
  };

  const performanceData = generatePerformanceData();
  const currentMetric = metrics.find(m => m.value === selectedMetric);
  const dataKey = currentMetric?.dataKey || "value";
  
  // Calculate statistics
  const values = performanceData.map(d => d[dataKey]).filter(v => typeof v === 'number');
  const average = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const best = values.length > 0 ? Math.max(...values) : 0;
  const worst = values.length > 0 ? Math.min(...values) : 0;

  // Calculate moving average if enabled
  const dataWithMovingAverage = showMovingAverage ? performanceData.map((item, index) => {
    if (index < 2) return { ...item, movingAverage: item[dataKey] };
    const slice = performanceData.slice(Math.max(0, index - 2), index + 1);
    const avg = slice.reduce((sum, d) => sum + d[dataKey], 0) / slice.length;
    return { ...item, movingAverage: avg };
  }) : performanceData;

  const formatValue = (value: number) => {
    if (selectedMetric === "distance" || selectedMetric === "sprint_distance") {
      return `${value} km`;
    }
    if (selectedMetric === "match_rating") {
      return value.toFixed(1);
    }
    return Math.round(value).toString();
  };

  return (
    <Card className="bg-slate-900 dark:bg-slate-900 border-club-gold/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-club-gold flex-shrink-0" />
            <CardTitle className="text-club-gold text-lg">Performance Trends</CardTitle>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Metric Selection */}
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-[180px] bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-club-dark-gray border-club-gold/30">
                {metrics.map((metric) => (
                  <SelectItem 
                    key={metric.value} 
                    value={metric.value}
                    className="text-club-light-gray hover:bg-club-gold/10 focus:bg-club-gold/10"
                  >
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Period Selection */}
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-full sm:w-[140px] bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-club-dark-gray border-club-gold/30">
                {timePeriods.map((period) => (
                  <SelectItem 
                    key={period.value} 
                    value={period.value}
                    className="text-club-light-gray hover:bg-club-gold/10 focus:bg-club-gold/10"
                  >
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chart View Selection */}
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="w-full sm:w-[120px] bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-club-dark-gray border-club-gold/30">
                {chartViews.map((view) => (
                  <SelectItem 
                    key={view.value} 
                    value={view.value}
                    className="text-club-light-gray hover:bg-club-gold/10 focus:bg-club-gold/10"
                  >
                    {view.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="moving-average"
              checked={showMovingAverage}
              onCheckedChange={setShowMovingAverage}
              className="data-[state=checked]:bg-club-gold"
            />
            <Label htmlFor="moving-average" className="text-club-light-gray text-sm">
              3-Match Moving Average
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="show-stats"
              checked={showStatistics}
              onCheckedChange={setShowStatistics}
              className="data-[state=checked]:bg-club-gold"
            />
            <Label htmlFor="show-stats" className="text-club-light-gray text-sm">
              Show Statistics
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistics Cards */}
        {showStatistics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-club-black/40 rounded-lg p-3 border border-club-gold/20">
              <div className="text-club-gold text-lg font-bold">{formatValue(average)}</div>
              <div className="text-club-light-gray/70 text-sm">Average</div>
            </div>
            <div className="bg-club-black/40 rounded-lg p-3 border border-club-gold/20">
              <div className="text-club-gold text-lg font-bold">{formatValue(best)}</div>
              <div className="text-club-light-gray/70 text-sm">Best</div>
            </div>
            <div className="bg-club-black/40 rounded-lg p-3 border border-club-gold/20">
              <div className="text-club-gold text-lg font-bold">{formatValue(worst)}</div>
              <div className="text-club-light-gray/70 text-sm">Worst</div>
            </div>
            <div className="bg-club-black/40 rounded-lg p-3 border border-club-gold/20">
              <div className="text-club-gold text-lg font-bold">{performanceData.length}</div>
              <div className="text-club-light-gray/70 text-sm">Matches</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataWithMovingAverage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="match" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #D4AF37',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#D4AF37' }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#D4AF37', strokeWidth: 2, fill: '#D4AF37' }}
              />
              {showMovingAverage && (
                <Line
                  type="monotone"
                  dataKey="movingAverage"
                  stroke="#D4AF37"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  opacity={0.7}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
