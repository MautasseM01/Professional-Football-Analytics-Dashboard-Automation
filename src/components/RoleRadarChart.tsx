
import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ResponsiveChart } from "@/components/ui/responsive-chart";
import { PlayerAttributes, PositionalAverage } from "@/hooks/use-player-attributes";
import { Player } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";

interface RoleRadarChartProps {
  player: Player | null;
  attributes: PlayerAttributes | null;
  positionalAverage: PositionalAverage | null;
  loading: boolean;
  error: string | null;
}

// iOS-style color palette
const iOS_COLORS = {
  primary: "#007AFF",
  secondary: "#34C759", 
  background: "#F2F2F7",
  gray: "#8E8E93",
  lightGray: "#F2F2F7"
};

export const RoleRadarChart = ({
  player,
  attributes,
  positionalAverage,
  loading,
  error
}: RoleRadarChartProps) => {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  const chartData = useMemo(() => {
    if (!attributes) return [];

    return [
      {
        attribute: isMobile ? "Finish" : "Finishing",
        player: attributes.finishing,
        average: positionalAverage?.finishing || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Aerial" : "Aerial Duels",
        player: attributes.aerial_duels_won,
        average: positionalAverage?.aerial_duels_won || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Hold-up" : "Hold-up Play",
        player: attributes.holdup_play,
        average: positionalAverage?.holdup_play || 0,
        fullMark: 100,
      },
      {
        attribute: "Pace",
        player: attributes.pace,
        average: positionalAverage?.pace || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Work Rate" : "Work Rate",
        player: attributes.work_rate_attacking,
        average: positionalAverage?.work_rate_attacking || 0,
        fullMark: 100,
      },
    ];
  }, [attributes, positionalAverage, isMobile]);

  const calculateOverallScore = (attrs: PlayerAttributes | null): number => {
    if (!attrs) return 0;
    
    const sum = attrs.finishing + 
                attrs.aerial_duels_won + 
                attrs.holdup_play + 
                attrs.pace + 
                attrs.work_rate_attacking;
    
    return Math.round(sum / 5);
  };

  const playerScore = calculateOverallScore(attributes);
  const averageScore = positionalAverage ? 
    Math.round((positionalAverage.finishing + 
                positionalAverage.aerial_duels_won + 
                positionalAverage.holdup_play + 
                positionalAverage.pace + 
                positionalAverage.work_rate_attacking) / 5) 
    : 0;

  const chartConfig = {
    player: { color: iOS_COLORS.primary },
    average: { color: iOS_COLORS.secondary }
  };

  // Simplified mobile view with iOS styling
  const SimplifiedMobileView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div key={index} className="bg-[#F2F2F7]/10 border border-[#F2F2F7]/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs text-[#8E8E93] mb-2 font-medium">{item.attribute}</div>
              <div className="text-xl font-semibold text-[#007AFF] mb-1">{item.player}</div>
              <div className="w-full bg-[#F2F2F7]/20 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-[#007AFF] h-1.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${item.player}%` }}
                />
              </div>
              {showBenchmark && (
                <div className="text-xs text-[#34C759] font-medium">Avg: {item.average}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Responsive chart height
  const getChartHeight = () => {
    if (breakpoint === 'mobile') return 200;
    if (breakpoint === 'tablet-portrait') return 280;
    if (breakpoint === 'tablet-landscape') return 320;
    return 350;
  };

  if (loading) {
    return (
      <Card className="border-[#F2F2F7]/20 bg-[#F2F2F7]/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#007AFF] text-sm sm:text-base lg:text-lg font-medium">
            Player Role Suitability: Striker
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[#8E8E93]">
            Loading player attributes...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-[#F2F2F7]/20 bg-[#F2F2F7]/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#007AFF] text-sm sm:text-base lg:text-lg font-medium">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 rounded-xl">
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className="border-[#F2F2F7]/20 bg-[#F2F2F7]/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#007AFF] text-sm sm:text-base lg:text-lg font-medium">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-[#FF9500]/10 border-[#FF9500]/30 rounded-xl">
            <AlertDescription className="text-xs sm:text-sm text-[#8E8E93]">
              No attribute data available for {player?.name || 'this player'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#F2F2F7]/20 bg-[#F2F2F7]/5 backdrop-blur-sm">
      <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-[#007AFF] text-sm sm:text-base lg:text-lg font-medium">
              Player Role Suitability: Striker
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-[#8E8E93]">
              Performance metrics for striker position
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Switch 
              id="show-benchmark" 
              checked={showBenchmark} 
              onCheckedChange={setShowBenchmark}
              className="data-[state=checked]:bg-[#34C759] data-[state=unchecked]:bg-[#F2F2F7]/20"
            />
            <Label htmlFor="show-benchmark" className="text-xs sm:text-sm whitespace-nowrap text-[#8E8E93] font-medium">
              Show Average
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ResponsiveChart
              config={chartConfig}
              showZoomControls={false}
              simplifiedMobileView={<SimplifiedMobileView />}
              aspectRatio={isMobile ? 1 : (4/3)}
              minHeight={getChartHeight()}
            >
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="75%"
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <PolarGrid 
                  stroke={iOS_COLORS.lightGray} 
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                />
                <PolarAngleAxis 
                  dataKey="attribute" 
                  stroke={iOS_COLORS.gray}
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fontSize: isMobile ? 10 : 12, fill: iOS_COLORS.gray, fontWeight: 500 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="transparent"
                  fontSize={isMobile ? 9 : 11}
                  tick={{ fontSize: isMobile ? 9 : 11, fill: iOS_COLORS.gray }}
                  tickCount={isMobile ? 3 : 4}
                />

                <Radar
                  name={player?.name || "Player"}
                  dataKey="player"
                  stroke={iOS_COLORS.primary}
                  fill={iOS_COLORS.primary}
                  fillOpacity={0.2}
                  strokeWidth={isMobile ? 1.5 : 2}
                  dot={{ r: 3, fill: iOS_COLORS.primary, strokeWidth: 0 }}
                />

                {showBenchmark && positionalAverage && (
                  <Radar
                    name="Position Average"
                    dataKey="average"
                    stroke={iOS_COLORS.secondary}
                    fill={iOS_COLORS.secondary}
                    fillOpacity={0.1}
                    strokeWidth={isMobile ? 1.5 : 2}
                    strokeDasharray="3 3"
                    dot={{ r: 2, fill: iOS_COLORS.secondary, strokeWidth: 0 }}
                  />
                )}

                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: isMobile ? '10px' : '12px',
                    color: '#1D1D1F',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
              </RadarChart>
            </ResponsiveChart>
          </div>
          <div className="space-y-4">
            <div className="bg-[#F2F2F7]/10 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
              <h3 className="text-[#007AFF] text-sm sm:text-base lg:text-lg font-semibold mb-3">
                Role Fit Score
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="truncate pr-2 text-[#8E8E93] font-medium">{player?.name || "Player"}</span>
                    <span className="font-bold flex-shrink-0 text-[#007AFF]">{playerScore}/100</span>
                  </div>
                  <div className="w-full bg-[#F2F2F7]/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#007AFF] to-[#34C759] h-2 rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${playerScore}%` }}
                    />
                  </div>
                </div>
                {showBenchmark && (
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-[#8E8E93] font-medium">Position Average</span>
                      <span className="font-bold text-[#34C759]">{averageScore}/100</span>
                    </div>
                    <div className="w-full bg-[#F2F2F7]/30 rounded-full h-2">
                      <div 
                        className="bg-[#34C759] h-2 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${averageScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2F2F7]/20">
                <h4 className="text-[#007AFF] font-semibold mb-2 text-xs sm:text-sm">
                  Key Strengths
                </h4>
                <ul className="text-xs space-y-2">
                  {chartData
                    .filter(item => item.player > (showBenchmark ? item.average : 70))
                    .slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#007AFF] mr-2 flex-shrink-0" />
                        <span className="truncate text-[#8E8E93]">
                          {item.attribute} ({item.player})
                        </span>
                      </li>
                    ))
                  }
                  {chartData.filter(item => item.player > (showBenchmark ? item.average : 70)).length === 0 && (
                    <li className="text-[#8E8E93] text-xs">
                      No significant strengths identified
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
