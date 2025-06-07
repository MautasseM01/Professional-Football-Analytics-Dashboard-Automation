
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
  ResponsiveContainer, 
  Area,
  AreaChart,
  defs,
  linearGradient,
  stop
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Monitor } from "lucide-react";

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

// iOS-style color palette
const iOS_COLORS = {
  primary: "#007AFF",
  secondary: "#34C759",
  tertiary: "#FF9500",
  background: "#F2F2F7",
  gray: "#8E8E93",
  lightGray: "#F2F2F7"
};

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
      match: `Match ${numMatches - i}`,
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

  // Responsive chart configuration with iOS styling
  const getChartConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        height: 200,
        fontSize: 10,
        strokeWidth: 1,
        dotRadius: 2,
        activeDotRadius: 4,
        margin: { top: 20, right: 20, left: 10, bottom: 30 }
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        height: 260,
        fontSize: 11,
        strokeWidth: 1.5,
        dotRadius: 2.5,
        activeDotRadius: 5,
        margin: { top: 25, right: 25, left: 15, bottom: 40 }
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        height: 300,
        fontSize: 12,
        strokeWidth: 1.5,
        dotRadius: 3,
        activeDotRadius: 5,
        margin: { top: 30, right: 30, left: 20, bottom: 50 }
      };
    }
    return {
      height: 350,
      fontSize: 12,
      strokeWidth: 2,
      dotRadius: 3,
      activeDotRadius: 6,
      margin: { top: 35, right: 35, left: 25, bottom: 60 }
    };
  };

  const chartConfig = getChartConfig();

  // If screen is too small, show message to use larger screen
  if (isVerySmallScreen) {
    return (
      <Card className="bg-club-dark-bg border-club-gold/20 w-full">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-club-gold/60" />
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-club-light-gray">
                Screen Too Small
              </h3>
              <p className="text-xs sm:text-sm text-club-light-gray/70 max-w-sm">
                Please use a larger screen or rotate your device for optimal chart viewing. 
                The performance trends chart requires at least 480px width for proper display.
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
            <CardTitle className="text-club-light-gray text-sm sm:text-base lg:text-lg xl:text-xl font-medium">
              {player.name}'s Performance
            </CardTitle>
            {!isMobile && (
              <div className="text-xs text-[#8E8E93] bg-[#F2F2F7]/10 px-2 py-1 rounded-full">
                {selectedKPILabel}
              </div>
            )}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Controls Container */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-club-light-gray/80 font-medium">Metric</Label>
                  <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                    <SelectTrigger className="w-full bg-[#F2F2F7]/5 border-[#F2F2F7]/20 text-club-light-gray h-8 sm:h-9 lg:h-10 text-xs sm:text-sm focus:ring-[#007AFF]/50 rounded-xl">
                      <SelectValue placeholder="Select KPI" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-[#F2F2F7]/20 text-club-light-gray z-50 max-h-60 rounded-xl">
                      {KPI_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-[#007AFF]/20 text-xs sm:text-sm rounded-lg">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-club-light-gray/80 font-medium">Period</Label>
                  <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                    <SelectTrigger className="w-full bg-[#F2F2F7]/5 border-[#F2F2F7]/20 text-club-light-gray h-8 sm:h-9 lg:h-10 text-xs sm:text-sm focus:ring-[#007AFF]/50 rounded-xl">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-[#F2F2F7]/20 text-club-light-gray z-50 rounded-xl">
                      {TIME_PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-[#007AFF]/20 text-xs sm:text-sm rounded-lg">
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
                    3-Match Average
                  </Label>
                  <Switch 
                    id="movingAverage" 
                    checked={showMovingAverage}
                    onCheckedChange={setShowMovingAverage}
                    className="data-[state=checked]:bg-[#007AFF] data-[state=unchecked]:bg-[#F2F2F7]/20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-1 sm:pt-2">
        <div className="w-full rounded-2xl bg-[#F2F2F7]/5 p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
          <ChartContainer 
            config={{
              value: { color: iOS_COLORS.primary },
              average: { color: iOS_COLORS.gray }
            }}
            aspectRatio={breakpoint === 'mobile' ? (4/3) : (16/10)}
            minHeight={chartConfig.height}
          >
            <AreaChart
              data={matchData}
              margin={chartConfig.margin}
            >
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={iOS_COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={iOS_COLORS.primary} stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={iOS_COLORS.gray} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={iOS_COLORS.gray} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="match" 
                stroke="transparent"
                tick={{ fill: iOS_COLORS.gray, fontSize: chartConfig.fontSize }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={chartConfig.margin.bottom}
                interval={breakpoint === 'mobile' ? 'preserveStartEnd' : 0}
              />
              <YAxis 
                stroke="transparent"
                tick={{ fill: iOS_COLORS.gray, fontSize: chartConfig.fontSize }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3 border-0 rounded-2xl shadow-2xl text-gray-800 max-w-[200px]">
                        <p className="font-semibold text-[#007AFF] text-sm">{payload[0].payload.match}</p>
                        <p className="text-[#8E8E93] text-xs mb-2">{payload[0].payload.date}</p>
                        <p className="text-gray-800 font-medium text-sm">{selectedKPILabel}: {payload[0].value}</p>
                        {showMovingAverage && payload[0].payload.movingAvg !== null && (
                          <p className="text-[#8E8E93] text-xs">3-Match Avg: {payload[0].payload.movingAvg}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={iOS_COLORS.primary}
                strokeWidth={chartConfig.strokeWidth}
                fill="url(#valueGradient)"
                dot={{ r: chartConfig.dotRadius, strokeWidth: 0, fill: iOS_COLORS.primary }}
                activeDot={{ 
                  r: chartConfig.activeDotRadius, 
                  strokeWidth: 2, 
                  stroke: "#fff",
                  fill: iOS_COLORS.primary,
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                }}
              />
              {showMovingAverage && !isMobile && (
                <Area
                  type="monotone"
                  dataKey="movingAvg"
                  stroke={iOS_COLORS.gray}
                  strokeDasharray="3 3"
                  strokeWidth={chartConfig.strokeWidth}
                  fill="url(#averageGradient)"
                  dot={false}
                />
              )}
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
