
import { useMemo } from "react";
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
import { PlayerAttributes, PositionalAverage } from "@/hooks/use-player-attributes";
import { Player } from "@/types";
import { useState } from "react";

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

  const chartData = useMemo(() => {
    if (!attributes) return [];

    return [
      {
        attribute: "Finishing",
        player: attributes.finishing,
        average: positionalAverage?.finishing || 0,
        fullMark: 100,
      },
      {
        attribute: "Aerial Duels",
        player: attributes.aerial_duels_won,
        average: positionalAverage?.aerial_duels_won || 0,
        fullMark: 100,
      },
      {
        attribute: "Hold-up Play",
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
        attribute: "Work Rate",
        player: attributes.work_rate_attacking,
        average: positionalAverage?.work_rate_attacking || 0,
        fullMark: 100,
      },
    ];
  }, [attributes, positionalAverage]);

  const calculateOverallScore = (attrs: PlayerAttributes | null): number => {
    if (!attrs) return 0;
    
    // Simple average of all attributes
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

  if (loading) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold">Player Role Suitability: Striker</CardTitle>
          <CardDescription>Loading player attributes...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold">Player Role Suitability: Striker</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className="border-club-gold/20 bg-club-dark-gray">
        <CardHeader>
          <CardTitle className="text-club-gold">Player Role Suitability: Striker</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription>
              No attribute data available for {player?.name || 'this player'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-club-gold">Player Role Suitability: Striker</CardTitle>
            <CardDescription>Performance metrics for striker position</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-benchmark" 
              checked={showBenchmark} 
              onCheckedChange={setShowBenchmark} 
            />
            <Label htmlFor="show-benchmark">Show Average</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={chartData}
              >
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="attribute" stroke="#CCC" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#666" />

                <Radar
                  name={player?.name || "Player"}
                  dataKey="player"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.5}
                />

                {showBenchmark && positionalAverage && (
                  <Radar
                    name="Position Average"
                    dataKey="average"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                  />
                )}

                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="bg-club-black/30 p-4 rounded-lg">
              <h3 className="text-club-gold text-lg font-bold mb-2">Role Fit Score</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{player?.name || "Player"}</span>
                    <span className="font-semibold">{playerScore}/100</span>
                  </div>
                  <div className="w-full bg-club-black/60 rounded-full h-2">
                    <div className="bg-club-gold h-2 rounded-full" style={{ width: `${playerScore}%` }}></div>
                  </div>
                </div>
                {showBenchmark && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Position Average</span>
                      <span className="font-semibold">{averageScore}/100</span>
                    </div>
                    <div className="w-full bg-club-black/60 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${averageScore}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-club-gold/20">
                <h4 className="text-club-gold font-semibold mb-2">Key Strengths</h4>
                <ul className="text-sm space-y-1">
                  {chartData
                    .filter(item => item.player > (showBenchmark ? item.average : 70))
                    .slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-club-gold mr-2"></span>
                        {item.attribute} ({item.player})
                      </li>
                    ))
                  }
                  {chartData.filter(item => item.player > (showBenchmark ? item.average : 70)).length === 0 && (
                    <li className="text-club-light-gray/70">No significant strengths identified</li>
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
