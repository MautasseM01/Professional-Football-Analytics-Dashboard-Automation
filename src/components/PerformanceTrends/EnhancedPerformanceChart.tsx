
import { useState } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { usePlayerMatchPerformance } from "@/hooks/use-player-match-performance";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { TrendingUp, Activity, Target, Users, Zap } from "lucide-react";

interface EnhancedPerformanceChartProps {
  player: Player;
}

export const EnhancedPerformanceChart = ({ player }: EnhancedPerformanceChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState("match_rating");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const { performances, loading, error } = usePlayerMatchPerformance(player, undefined, 15);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!performances || performances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = performances.map((perf, index) => ({
    match: `M${index + 1}`,
    opponent: perf.opponent,
    date: perf.match_date,
    match_rating: perf.match_rating,
    goals: perf.goals,
    assists: perf.assists,
    goal_contributions: perf.goals + perf.assists,
    pass_accuracy: perf.pass_accuracy,
    distance_covered: perf.distance_covered,
    tackles_won: perf.tackles_won,
    shots_on_target: perf.shots_on_target,
    dribbles_successful: perf.dribbles_successful,
    aerial_duels_won: perf.aerial_duels_won,
    touches: perf.touches,
    sprint_distance: perf.sprint_distance,
    max_speed: perf.max_speed
  })).reverse(); // Show chronological order

  const metricOptions = [
    { value: "match_rating", label: "Match Rating", icon: TrendingUp, unit: "/10" },
    { value: "goal_contributions", label: "Goals + Assists", icon: Target, unit: "" },
    { value: "pass_accuracy", label: "Pass Accuracy", icon: Users, unit: "%" },
    { value: "distance_covered", label: "Distance Covered", icon: Activity, unit: "km" },
    { value: "tackles_won", label: "Tackles Won", icon: Zap, unit: "" },
    { value: "shots_on_target", label: "Shots on Target", icon: Target, unit: "" },
    { value: "dribbles_successful", label: "Successful Dribbles", icon: Zap, unit: "" },
    { value: "touches", label: "Touches", icon: Users, unit: "" },
    { value: "max_speed", label: "Max Speed", icon: Activity, unit: "km/h" }
  ];

  const selectedMetricOption = metricOptions.find(m => m.value === selectedMetric);
  const currentAverage = chartData.reduce((sum, d) => sum + (d[selectedMetric as keyof typeof d] as number), 0) / chartData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">vs {data.opponent}</p>
          <p className="text-sm text-muted-foreground">{new Date(data.date).toLocaleDateString()}</p>
          <p className="text-sm">
            <span style={{ color: payload[0].color }}>
              {selectedMetricOption?.label}: {payload[0].value.toFixed(1)}{selectedMetricOption?.unit}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {selectedMetricOption?.icon && <selectedMetricOption.icon className="h-5 w-5" />}
            Performance Trends
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: "line" | "bar") => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {chartData.length} matches
          </Badge>
          <Badge variant="secondary">
            Avg: {currentAverage.toFixed(1)}{selectedMetricOption?.unit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={selectedMetric} fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
