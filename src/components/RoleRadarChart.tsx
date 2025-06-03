
import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartContainer } from "@/components/ui/chart";
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

  // Responsive chart configuration
  const getChartConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        outerRadius: "75%",
        fontSize: 10,
        margin: { top: 10, right: 10, bottom: 10, left: 10 }
      };
    }
    if (breakpoint === 'tablet-portrait' || breakpoint === 'tablet-landscape') {
      return {
        outerRadius: "80%",
        fontSize: 11,
        margin: { top: 15, right: 15, bottom: 15, left: 15 }
      };
    }
    return {
      outerRadius: "80%",
      fontSize: 12,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    };
  };

  const chartConfig = getChartConfig();

  if (loading) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold text-sm sm:text-base lg:text-lg">
            Player Role Suitability: Striker
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Loading player attributes...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold text-sm sm:text-base lg:text-lg">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold text-sm sm:text-base lg:text-lg">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription className="text-xs sm:text-sm">
              No attribute data available for {player?.name || 'this player'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-club-gold text-sm sm:text-base lg:text-lg">
              Player Role Suitability: Striker
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Performance metrics for striker position
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Switch 
              id="show-benchmark" 
              checked={showBenchmark} 
              onCheckedChange={setShowBenchmark} 
            />
            <Label htmlFor="show-benchmark" className="text-xs sm:text-sm whitespace-nowrap">
              Show Average
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ChartContainer
              config={{
                player: { color: "#f97316" },
                average: { color: "#16a34a" }
              }}
              aspectRatio={isMobile ? 1 : (4/3)}
              minHeight={isMobile ? 250 : 300}
            >
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius={chartConfig.outerRadius}
                data={chartData}
                margin={chartConfig.margin}
              >
                <PolarGrid 
                  stroke="#444" 
                  strokeWidth={isMobile ? 0.5 : 1}
                />
                <PolarAngleAxis 
                  dataKey="attribute" 
                  stroke="#CCC" 
                  fontSize={chartConfig.fontSize}
                  tick={{ fontSize: chartConfig.fontSize }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="#666" 
                  fontSize={chartConfig.fontSize - 1}
                  tick={{ fontSize: chartConfig.fontSize - 1 }}
                  tickCount={isMobile ? 3 : 5}
                />

                <Radar
                  name={player?.name || "Player"}
                  dataKey="player"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.5}
                  strokeWidth={isMobile ? 1.5 : 2}
                />

                {showBenchmark && positionalAverage && (
                  <Radar
                    name="Position Average"
                    dataKey="average"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                    strokeWidth={isMobile ? 1.5 : 2}
                  />
                )}

                {!isMobile && <Legend />}
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #D4AF37',
                    borderRadius: '8px',
                    fontSize: isMobile ? '10px' : '12px'
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-club-black/30 p-3 sm:p-4 rounded-lg">
              <h3 className="text-club-gold text-sm sm:text-base lg:text-lg font-bold mb-3">
                Role Fit Score
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="truncate pr-2">{player?.name || "Player"}</span>
                    <span className="font-semibold flex-shrink-0">{playerScore}/100</span>
                  </div>
                  <div className="w-full bg-club-black/60 rounded-full h-2">
                    <div 
                      className="bg-club-gold h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${playerScore}%` }}
                    />
                  </div>
                </div>
                {showBenchmark && (
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span>Position Average</span>
                      <span className="font-semibold">{averageScore}/100</span>
                    </div>
                    <div className="w-full bg-club-black/60 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${averageScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-club-gold/20">
                <h4 className="text-club-gold font-semibold mb-2 text-xs sm:text-sm">
                  Key Strengths
                </h4>
                <ul className="text-xs space-y-1">
                  {chartData
                    .filter(item => item.player > (showBenchmark ? item.average : 70))
                    .slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-club-gold mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {item.attribute} ({item.player})
                        </span>
                      </li>
                    ))
                  }
                  {chartData.filter(item => item.player > (showBenchmark ? item.average : 70)).length === 0 && (
                    <li className="text-club-light-gray/70 text-xs">
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
