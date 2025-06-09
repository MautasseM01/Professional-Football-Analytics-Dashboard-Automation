
import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip 
} from "@/components/ui/chart";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Monitor, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceTrendsCardProps {
  player: Player;
}

// KPI options for the dropdown
const KPI_OPTIONS = [
  { value: "sprintDistance", label: "Sprint Distance (km)" },
  { value: "passes_completed", label: "Passes Completed" },
  { value: "shots_on_target", label: "Shots on Target" },
  { value: "tackles_won", label: "Tackles Won" },
  { value: "distance", label: "Total Distance (km)" }
];

// Time period options
const TIME_PERIOD_OPTIONS = [
  { value: "last5", label: "Last 5 Matches" },
  { value: "last10", label: "Last 10 Matches" },
  { value: "season", label: "Season to Date" }
];

// Helper function to generate mock match data based on a player stat
const generateMatchData = (player: Player, kpi: string, numMatches: number) => {
  const baseValue = player[kpi as keyof Player] as number || 0;
  
  return Array.from({ length: numMatches }, (_, i) => {
    let variationFactor = 0.2;
    
    if (kpi === "sprintDistance" || kpi === "distance") {
      variationFactor = 0.15;
    } else if (kpi === "tackles_won" || kpi === "shots_on_target") {
      variationFactor = 0.3;
    }
    
    const variation = (Math.random() * 2 - 1) * variationFactor;
    const value = Math.max(0, baseValue * (1 + variation));
    
    const roundedValue = kpi === "sprintDistance" || kpi === "distance" 
      ? Number(value.toFixed(2)) 
      : Math.round(value);
    
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - (i * 7));
    
    return {
      match: `M${numMatches - i}`,
      date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: roundedValue,
    };
  }).reverse();
};

// Calculate moving average for a dataset
const calculateMovingAverage = (data: Array<{value: number}>, windowSize: number) => {
  return data.map((point, index, array) => {
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      sum += array[index - i].value;
    }
    
    return {
      ...point,
      movingAvg: Number((sum / windowSize).toFixed(2))
    };
  });
};

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showSimplified, setShowSimplified] = useState(false);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  
  // Check if screen is too small for optimal chart viewing
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 480;
  
  // Get the selected KPI label
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  
  // Determine the number of matches based on selected time period
  const getMatchCount = () => {
    switch (selectedTimePeriod) {
      case "last5": return 5;
      case "last10": return 10;
      case "season": return 15;
      default: return 5;
    }
  };
  
  // Generate match data based on selected KPI and time period
  const matchData = useMemo(() => {
    const numMatches = getMatchCount();
    const rawData = generateMatchData(player, selectedKPI, numMatches);
    
    return showMovingAverage 
      ? calculateMovingAverage(rawData, 3)
      : rawData;
  }, [player, selectedKPI, selectedTimePeriod, showMovingAverage]);

  // Simplified mobile view
  const SimplifiedTrendsView = () => {
    const latest = matchData[matchData.length - 1];
    const previous = matchData[matchData.length - 2];
    const trend = latest && previous ? 
      ((latest.value - previous.value) / previous.value * 100) : 0;
    
    const average = matchData.reduce((sum, d) => sum + d.value, 0) / matchData.length;
    const highest = Math.max(...matchData.map(d => d.value));
    const lowest = Math.min(...matchData.map(d => d.value));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Summary
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(false)}
            className="text-xs"
          >
            Show Chart
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-lg font-bold text-primary">{latest?.value}</p>
            <p className="text-xs text-muted-foreground">Latest</p>
            {trend !== 0 && (
              <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-lg font-bold text-blue-600">{average.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-lg font-bold text-green-600">{highest}</p>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-lg font-bold text-orange-600">{lowest}</p>
            <p className="text-xs text-muted-foreground">Lowest</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Recent Matches</Label>
          <div className="space-y-2">
            {matchData.slice(-3).reverse().map((match, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{match.match}</span>
                <span className="text-sm font-medium">{match.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Responsive chart configuration
  const getChartConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        height: showSimplified ? 150 : 220,
        fontSize: 9,
        strokeWidth: 1.5,
        dotRadius: 2,
        activeDotRadius: 3,
        margin: { top: 10, right: 15, left: 10, bottom: 30 }
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        height: 280,
        fontSize: 10,
        strokeWidth: 2,
        dotRadius: 2.5,
        activeDotRadius: 4,
        margin: { top: 15, right: 20, left: 15, bottom: 40 }
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        height: 320,
        fontSize: 11,
        strokeWidth: 2,
        dotRadius: 3,
        activeDotRadius: 5,
        margin: { top: 20, right: 25, left: 20, bottom: 50 }
      };
    }
    return {
      height: 380,
      fontSize: 12,
      strokeWidth: 2.5,
      dotRadius: 3,
      activeDotRadius: 6,
      margin: { top: 25, right: 30, left: 25, bottom: 60 }
    };
  };

  const chartConfig = getChartConfig();

  if (isMobile && showSimplified) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20 w-full">
        <CardContent className="p-4">
          <SimplifiedTrendsView />
        </CardContent>
      </Card>
    );
  }

  // If screen is too small, show simplified view by default
  if (isVerySmallScreen) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20 w-full">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <Monitor className="w-10 h-10 text-club-gold/60" />
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-club-light-gray">
                Screen Too Small
              </h3>
              <p className="text-xs text-club-light-gray/70 max-w-sm">
                Please use a larger screen or rotate your device for optimal chart viewing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-club-dark-bg border-club-gold/20 w-full">
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-club-light-gray text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
              {player.name}'s Performance Trend
            </CardTitle>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSimplified(true)}
                className="text-xs flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Summary
              </Button>
            )}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Controls Container */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-club-light-gray/80 font-medium">Performance Metric</Label>
                  <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                    <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray h-8 sm:h-9 lg:h-10 text-xs sm:text-sm focus:ring-club-gold/50">
                      <SelectValue placeholder="Select KPI" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray z-50 max-h-60">
                      {KPI_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-club-gold/20 text-xs sm:text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-club-light-gray/80 font-medium">Time Period</Label>
                  <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                    <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray h-8 sm:h-9 lg:h-10 text-xs sm:text-sm focus:ring-club-gold/50">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray z-50">
                      {TIME_PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-club-gold/20 text-xs sm:text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Switch Row - Hide on very small screens */}
              {!isMobile && (
                <div className="flex items-center justify-between pt-1">
                  <Label 
                    htmlFor="movingAverage"
                    className="text-club-light-gray text-xs sm:text-sm cursor-pointer select-none font-medium"
                  >
                    Show 3-Match Moving Average
                  </Label>
                  <Switch 
                    id="movingAverage" 
                    checked={showMovingAverage}
                    onCheckedChange={setShowMovingAverage}
                    className="data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-1 sm:pt-2">
        <div className="w-full rounded-lg bg-club-black/30 p-2 sm:p-3 lg:p-4 overflow-hidden">
          <div className="w-full" style={{ height: `${chartConfig.height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={matchData}
                margin={chartConfig.margin}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis 
                  dataKey="match" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: chartConfig.fontSize }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={chartConfig.margin.bottom}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: chartConfig.fontSize }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  width={isMobile ? 35 : 50}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-club-black/95 p-2 sm:p-3 border border-club-gold/30 rounded-lg shadow-lg text-club-light-gray backdrop-blur-sm max-w-[200px]">
                          <p className="font-semibold text-club-gold text-xs sm:text-sm">{payload[0].payload.match}</p>
                          <p className="text-club-light-gray/80 text-xs mb-1">{payload[0].payload.date}</p>
                          <p className="text-club-gold font-medium text-xs sm:text-sm">{selectedKPILabel}: {payload[0].value}</p>
                          {showMovingAverage && payload[0].payload.movingAvg !== null && (
                            <p className="text-gray-400 text-xs">3-Match Avg: {payload[0].payload.movingAvg}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {!isMobile && (
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    formatter={(value) => (
                      <span style={{ color: "#9CA3AF", fontSize: `${chartConfig.fontSize}px` }}>{value}</span>
                    )}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedKPILabel}
                  stroke="#D4AF37"
                  strokeWidth={chartConfig.strokeWidth}
                  dot={{ r: chartConfig.dotRadius, strokeWidth: 2, fill: "#D4AF37" }}
                  activeDot={{ r: chartConfig.activeDotRadius, strokeWidth: 2, fill: "#D4AF37" }}
                />
                {showMovingAverage && !isMobile && (
                  <Line
                    type="monotone"
                    dataKey="movingAvg"
                    name="3-Match Average"
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    strokeWidth={chartConfig.strokeWidth}
                    dot={false}
                  />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
