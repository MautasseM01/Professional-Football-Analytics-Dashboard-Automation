
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  
  // Generate random variations around the base value
  return Array.from({ length: numMatches }, (_, i) => {
    // Ensure numbers are reasonable by using variation factor based on the stat
    let variationFactor = 0.2; // Default 20% variation
    
    // Different variation factors for different stats
    if (kpi === "sprintDistance" || kpi === "distance") {
      variationFactor = 0.15; // 15% variation for distance metrics
    } else if (kpi === "tackles_won" || kpi === "shots_on_target") {
      variationFactor = 0.3; // 30% variation for count metrics
    }
    
    // Generate a value between baseValue * (1-variation) and baseValue * (1+variation)
    const variation = (Math.random() * 2 - 1) * variationFactor;
    const value = Math.max(0, baseValue * (1 + variation));
    
    // Round appropriately based on stat type
    const roundedValue = kpi === "sprintDistance" || kpi === "distance" 
      ? Number(value.toFixed(2)) 
      : Math.round(value);
    
    // Match date is calculated backwards from "today"
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - (i * 7)); // Assume weekly matches
    
    return {
      match: `Match ${numMatches - i}`,
      date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: roundedValue,
    };
  }).reverse(); // Most recent match last
};

// Calculate moving average for a dataset
const calculateMovingAverage = (data: Array<{value: number}>, windowSize: number) => {
  return data.map((point, index, array) => {
    // Not enough data points for the window, return null
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    // Calculate the sum of values in the window
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      sum += array[index - i].value;
    }
    
    // Return the average
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
  
  // Get the selected KPI label
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  
  // Determine the number of matches based on selected time period
  const getMatchCount = () => {
    switch (selectedTimePeriod) {
      case "last5": return 5;
      case "last10": return 10;
      case "season": return 15; // Assuming a season has 15 matches for demo purposes
      default: return 5;
    }
  };
  
  // Generate match data based on selected KPI and time period
  const matchData = useMemo(() => {
    const numMatches = getMatchCount();
    const rawData = generateMatchData(player, selectedKPI, numMatches);
    
    return showMovingAverage 
      ? calculateMovingAverage(rawData, 3) // 3-match moving average
      : rawData;
  }, [player, selectedKPI, selectedTimePeriod, showMovingAverage]);
  
  return (
    <Card className="bg-club-dark-bg border-club-gold/20 w-full">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-club-light-gray text-lg sm:text-xl">
            {player.name}'s Performance Trend
          </CardTitle>
          
          <div className="flex flex-col gap-3">
            {/* First row: Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0">
                <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                  <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray h-9 sm:h-10">
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray z-50">
                    {KPI_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-0">
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray h-9 sm:h-10">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray z-50">
                    {TIME_PERIOD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Second row: Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="movingAverage" 
                checked={showMovingAverage}
                onCheckedChange={(checked) => setShowMovingAverage(!!checked)}
                className="data-[state=checked]:bg-club-gold data-[state=checked]:border-club-gold"
              />
              <Label 
                htmlFor="movingAverage"
                className="text-club-light-gray text-sm cursor-pointer select-none"
              >
                Show 3-Match Average
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 pt-2">
        <div className="h-[300px] sm:h-[350px] w-full">
          <ChartContainer 
            config={{
              value: { color: "#D4AF37" }, // Club gold color 
              average: { color: "#9CA3AF" } // Gray color for moving average
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={matchData}
                margin={{ 
                  top: 20, 
                  right: 10, 
                  left: 10, 
                  bottom: 60 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="match" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  label={{ 
                    value: 'Match', 
                    position: 'insideBottom', 
                    offset: -15, 
                    fill: '#9CA3AF',
                    fontSize: 12
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  label={{ 
                    value: selectedKPILabel, 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle' }, 
                    fill: '#9CA3AF',
                    fontSize: 12
                  }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-club-black p-3 border border-club-gold/30 rounded shadow text-club-light-gray text-sm">
                          <p className="font-semibold">{payload[0].payload.match}</p>
                          <p className="text-club-light-gray">{payload[0].payload.date}</p>
                          <p className="text-club-gold">{selectedKPILabel}: {payload[0].value}</p>
                          {showMovingAverage && payload[0].payload.movingAvg !== null && (
                            <p className="text-gray-400">3-Match Avg: {payload[0].payload.movingAvg}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => (
                    <span style={{ color: "#9CA3AF", fontSize: "12px" }}>{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedKPILabel}
                  stroke="#D4AF37" // Club gold
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
                {showMovingAverage && (
                  <Line
                    type="monotone"
                    dataKey="movingAvg"
                    name="3-Match Average"
                    stroke="#9CA3AF" // Gray
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
