import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorFallback } from "@/components/ErrorStates/ErrorFallback";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Users, Zap, Loader, MapPin, Eye, Award, BarChart3, Focus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface PerformanceTrendsCardProps {
  player: Player;
}

const KPI_OPTIONS = [
  { value: "distance_covered", label: "Total Distance (km)", unit: "km", icon: MapPin },
  { value: "sprint_distance", label: "Sprint Distance (km)", unit: "km", icon: Zap },
  { value: "match_rating", label: "Match Rating", unit: "/10", icon: Award },
  { value: "goals", label: "Goals", unit: "", icon: Target },
  { value: "assists", label: "Assists", unit: "", icon: Users },
  { value: "passes_completed", label: "Passes Completed", unit: "", icon: Activity },
  { value: "shots_on_target", label: "Shots on Target", unit: "", icon: Focus },
  { value: "tackles_won", label: "Tackles Won", unit: "", icon: BarChart3 },
];

const TIME_PERIOD_OPTIONS = [
  { value: "last3", label: "Last 3 Matches" },
  { value: "last5", label: "Last 5 Matches" },
  { value: "last10", label: "Last 10 Matches" },
  { value: "season", label: "Season to Date" }
];

const CHART_VIEW_OPTIONS = [
  { value: "area", label: "Area Chart" },
  { value: "line", label: "Line Chart" }
];

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance_covered");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("season");
  const [chartView, setChartView] = useState("area");
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 15);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!performances || performances.length === 0) return [];
    
    return performances.map((perf, index) => {
      let value = 0;
      switch (selectedKPI) {
        case "distance_covered":
          value = Number(perf.distance_covered) || 0;
          break;
        case "sprint_distance":
          value = Number(perf.sprint_distance) || 0;
          break;
        case "match_rating":
          value = Number(perf.match_rating) || 0;
          break;
        case "goals":
          value = perf.goals || 0;
          break;
        case "assists":
          value = perf.assists || 0;
          break;
        case "passes_completed":
          value = perf.passes_completed || 0;
          break;
        case "shots_on_target":
          value = perf.shots_on_target || 0;
          break;
        case "tackles_won":
          value = perf.tackles_won || 0;
          break;
        default:
          value = 0;
      }

      // Calculate moving average
      let movingAvg = null;
      if (index >= 2) {
        const last3Values = performances.slice(Math.max(0, index - 2), index + 1).map(p => {
          switch (selectedKPI) {
            case "distance_covered": return Number(p.distance_covered) || 0;
            case "sprint_distance": return Number(p.sprint_distance) || 0;
            case "match_rating": return Number(p.match_rating) || 0;
            case "goals": return p.goals || 0;
            case "assists": return p.assists || 0;
            case "passes_completed": return p.passes_completed || 0;
            case "shots_on_target": return p.shots_on_target || 0;
            case "tackles_won": return p.tackles_won || 0;
            default: return 0;
          }
        });
        movingAvg = last3Values.reduce((sum, val) => sum + val, 0) / last3Values.length;
      }

      return {
        match: `vs ${perf.opponent}`,
        date: new Date(perf.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: selectedKPI.includes("distance") ? Number(value.toFixed(2)) : Number(value.toFixed(1)),
        movingAvg: movingAvg ? (selectedKPI.includes("distance") ? Number(movingAvg.toFixed(2)) : Number(movingAvg.toFixed(1))) : null,
        opponent: perf.opponent,
        result: perf.result
      };
    }).reverse(); // Show chronological order
  }, [performances, selectedKPI]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, max: 0, min: 0, trend: 'neutral' as const };
    
    const values = chartData.map(d => d.value);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Calculate trend (last 3 vs previous 3)
    const recent = values.slice(-3);
    const previous = values.slice(-6, -3);
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : recentAvg;
    
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (recentAvg > previousAvg * 1.1) trend = 'up';
    else if (recentAvg < previousAvg * 0.9) trend = 'down';
    
    return { 
      avg: selectedKPI.includes("distance") ? Number(avg.toFixed(2)) : Number(avg.toFixed(1)), 
      max: selectedKPI.includes("distance") ? Number(max.toFixed(2)) : Number(max.toFixed(1)), 
      min: selectedKPI.includes("distance") ? Number(min.toFixed(2)) : Number(min.toFixed(1)), 
      trend 
    };
  }, [chartData, selectedKPI]);

  const selectedKPIOption = KPI_OPTIONS.find(option => option.value === selectedKPI);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={cn(
          "border rounded-xl shadow-2xl backdrop-blur-md p-3 transition-all duration-200",
          theme === 'dark' 
            ? "bg-club-dark-gray/95 border-club-gold/30 text-club-light-gray" 
            : "bg-white/95 border-club-gold/40 text-gray-900"
        )}>
          <p className="font-semibold text-club-gold text-sm">{data.match}</p>
          <p className={cn(
            "text-xs mb-1",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>{data.date}</p>
          <p className="text-club-gold font-medium text-sm">
            {selectedKPIOption?.label}: {payload[0].value}{selectedKPIOption?.unit}
          </p>
          {showMovingAverage && data.movingAvg !== null && (
            <p className={cn(
              "text-xs",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>
              3-Match Avg: {data.movingAvg}{selectedKPIOption?.unit}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <TrendingUp className="w-5 h-5" />
            {player.name}'s Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-2">
            <Loader className="h-8 w-8 text-club-gold animate-spin" />
            <p className="text-sm text-club-light-gray">Loading performance trends...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <TrendingUp className="w-5 h-5" />
            {player.name}'s Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ErrorFallback 
            title="Performance trends error"
            description={`Failed to load performance trends: ${error}`}
          />
        </CardContent>
      </Card>
    );
  }

  if (!performances || performances.length === 0 || chartData.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <TrendingUp className="w-5 h-5" />
            {player.name}'s Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <TrendingUp className="w-12 h-12 mx-auto text-club-light-gray/40 light:text-gray-400" />
            <div>
              <p className="text-club-light-gray light:text-gray-700">No performance data available</p>
              <p className="text-sm text-club-light-gray/60 light:text-gray-500 mt-1">
                No match performance data to create trends analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-club-gold/20 transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray hover:bg-club-dark-gray/80" 
        : "bg-white hover:bg-gray-50"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-club-gold">
            <TrendingUp className="w-5 h-5" />
            {player.name}'s Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            {stats.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {stats.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
            {stats.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-500" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-3"
        )}>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Performance Metric</Label>
            <Select value={selectedKPI} onValueChange={setSelectedKPI}>
              <SelectTrigger className={cn(
                "w-full transition-all duration-200",
                theme === 'dark' 
                  ? "bg-club-dark-gray/50 border-club-gold/20 text-club-light-gray hover:border-club-gold/40" 
                  : "bg-white/70 border-club-gold/30 text-gray-900 hover:border-club-gold/50"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={cn(
                "z-50 backdrop-blur-md border-club-gold/30",
                theme === 'dark' 
                  ? "bg-club-dark-gray/95 text-club-light-gray" 
                  : "bg-white/95 text-gray-900"
              )}>
                {KPI_OPTIONS.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150",
                        "focus:bg-club-gold/20 hover:bg-club-gold/10",
                        selectedKPI === option.value && "bg-club-gold/20 text-club-gold"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={cn(
                          "w-4 h-4",
                          selectedKPI === option.value ? "text-club-gold" : "text-gray-500"
                        )} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Period</Label>
            <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIOD_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Chart View</Label>
            <Select value={chartView} onValueChange={setChartView}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_VIEW_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="showStatistics" className="cursor-pointer select-none font-medium">
                Show Statistics
              </Label>
              <Switch 
                id="showStatistics" 
                checked={showStatistics} 
                onCheckedChange={setShowStatistics}
                className="data-[state=checked]:bg-club-gold"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="movingAverage" className="cursor-pointer select-none font-medium">
                3-Match Moving Average
              </Label>
              <Switch 
                id="movingAverage" 
                checked={showMovingAverage} 
                onCheckedChange={setShowMovingAverage}
                className="data-[state=checked]:bg-club-gold"
              />
            </div>
          </div>
          
          <Badge variant="outline">
            {chartData.length} matches
          </Badge>
        </div>

        {/* Statistics Display */}
        {showStatistics && (
          <div className={cn(
            "grid gap-4 p-4 rounded-2xl transition-all duration-300",
            isMobile ? "grid-cols-2" : "grid-cols-4",
            theme === 'dark' 
              ? "bg-club-black/30 border border-club-gold/10" 
              : "bg-gray-50/50 border border-club-gold/20"
          )}>
            <div className="text-center">
              <div className="text-lg font-bold text-club-gold">
                {stats.avg}{selectedKPIOption?.unit}
              </div>
              <div className={cn(
                "text-xs",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
              )}>Average</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">
                {stats.max}{selectedKPIOption?.unit}
              </div>
              <div className={cn(
                "text-xs",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
              )}>Best</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">
                {stats.min}{selectedKPIOption?.unit}
              </div>
              <div className={cn(
                "text-xs",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
              )}>Worst</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {chartData.length}
              </div>
              <div className={cn(
                "text-xs",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
              )}>Matches</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                <XAxis 
                  dataKey="match" 
                  stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                  tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                  tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#metricGradient)"
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                />
                {showMovingAverage && (
                  <Area
                    type="monotone"
                    dataKey="movingAvg"
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    fill="transparent"
                    dot={false}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                <XAxis 
                  dataKey="match" 
                  stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                  tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                  tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                />
                {showMovingAverage && (
                  <Line
                    type="monotone"
                    dataKey="movingAvg"
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
