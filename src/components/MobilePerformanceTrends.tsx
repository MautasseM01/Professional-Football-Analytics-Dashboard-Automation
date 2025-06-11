
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface MobilePerformanceTrendsProps {
  player: Player;
}

export const MobilePerformanceTrends = ({ player }: MobilePerformanceTrendsProps) => {
  const { theme } = useTheme();

  // Mock trend data - in real implementation, this would come from props or API
  const trendData = [
    { label: "Goals", current: 8, previous: 6, trend: "up" },
    { label: "Assists", current: 12, previous: 10, trend: "up" },
    { label: "Distance", current: 11.2, previous: 10.8, trend: "up" },
    { label: "Pass Accuracy", current: 87, previous: 89, trend: "down" }
  ];

  // Mock performance data for charts
  const performanceData = [
    { match: 'Match 1', goals: 1, assists: 2, distance: 10.5, passAccuracy: 85 },
    { match: 'Match 2', goals: 0, assists: 1, distance: 11.2, passAccuracy: 88 },
    { match: 'Match 3', goals: 2, assists: 0, distance: 10.8, passAccuracy: 82 },
    { match: 'Match 4', goals: 1, assists: 3, distance: 11.5, passAccuracy: 91 },
    { match: 'Match 5', goals: 0, assists: 1, distance: 10.2, passAccuracy: 87 },
  ];

  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/50 border-club-gold/20" 
        : "bg-white/90 border-club-gold/30"
    )}>
      <CardHeader className={cn(
        "border-b pb-4 p-4",
        theme === 'dark' 
          ? "bg-club-black/40 border-club-gold/20" 
          : "bg-blue-50/80 border-club-gold/30"
      )}>
        <CardTitle className={cn(
          "font-bold tracking-tight flex items-center gap-2 text-base",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
        )}>
          <Activity className="text-club-gold w-4 h-4" />
          Key Performance Trends
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Performance Stats Cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {trendData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-3 border border-club-gold/20 transition-all duration-200 min-h-[70px] flex flex-col justify-center",
                theme === 'dark' 
                  ? "bg-club-black/30 hover:bg-club-black/40" 
                  : "bg-white/50 hover:bg-white/70"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "font-medium text-xs",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
                )}>
                  {item.label}
                </span>
                {item.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="font-bold text-club-gold text-sm">
                  {typeof item.current === 'number' && item.current % 1 !== 0 
                    ? item.current.toFixed(1) 
                    : item.current}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
                
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/60" : "text-gray-500"
                )}>
                  Prev: {item.previous}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Goals & Assists Chart */}
        <div className={cn(
          "rounded-lg border border-club-gold/20 p-4 w-full",
          theme === 'dark' 
            ? "bg-club-black/20" 
            : "bg-gray-50/50"
        )}>
          <h4 className="font-medium mb-3 text-club-gold text-sm">
            Goals & Assists Trend
          </h4>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="match" 
                  tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: '1px solid #d97706',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="goals" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706', r: 4 }} />
                <Line type="monotone" dataKey="assists" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics Chart */}
        <div className={cn(
          "rounded-lg border border-club-gold/20 p-4 w-full",
          theme === 'dark' 
            ? "bg-club-black/20" 
            : "bg-gray-50/50"
        )}>
          <h4 className="font-medium mb-3 text-club-gold text-sm">
            Distance & Pass Accuracy
          </h4>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="match" 
                  tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: '1px solid #d97706',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="distance" fill="#3b82f6" />
                <Bar dataKey="passAccuracy" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
