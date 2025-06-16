
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchRating } from "@/hooks/use-match-ratings";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

interface PerformanceCorrelationProps {
  ratings: MatchRating[];
}

export const PerformanceCorrelation = ({ ratings }: PerformanceCorrelationProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No correlation data available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for different correlation charts
  const attackingVsDefensive = ratings.map(r => ({
    x: r.attacking_rating,
    y: r.defensive_rating,
    overall: r.overall_performance,
    opponent: r.opponent,
    result: r.result
  }));

  const possessionVsTactical = ratings.map(r => ({
    x: r.possession_rating,
    y: r.tactical_execution,
    overall: r.overall_performance,
    opponent: r.opponent,
    result: r.result
  }));

  const physicalVsMental = ratings.map(r => ({
    x: r.physical_performance,
    y: r.mental_strength,
    overall: r.overall_performance,
    opponent: r.opponent,
    result: r.result
  }));

  const getResultColor = (result: string) => {
    if (result.includes('W')) return '#22c55e'; // green
    if (result.includes('D')) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded-lg shadow-lg">
          <p className="font-medium">{data.opponent}</p>
          <p className="text-sm">Result: {data.result}</p>
          <p className="text-sm">Overall: {data.overall.toFixed(1)}</p>
          <p className="text-sm">X: {data.x.toFixed(1)}</p>
          <p className="text-sm">Y: {data.y.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <ResponsiveGrid minCardWidth="400px">
        <Card>
          <CardHeader>
            <CardTitle>Attacking vs Defensive Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={attackingVsDefensive}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="Attacking Rating"
                    domain={[0, 10]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Defensive Rating"
                    domain={[0, 10]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter dataKey="overall">
                    {attackingVsDefensive.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getResultColor(entry.result)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Possession vs Tactical Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={possessionVsTactical}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="Possession Rating"
                    domain={[0, 10]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Tactical Execution"
                    domain={[0, 10]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter dataKey="overall">
                    {possessionVsTactical.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getResultColor(entry.result)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      <Card>
        <CardHeader>
          <CardTitle>Physical vs Mental Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={physicalVsMental}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  name="Physical Performance"
                  domain={[0, 10]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <YAxis 
                  dataKey="y" 
                  name="Mental Strength"
                  domain={[0, 10]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter dataKey="overall">
                  {physicalVsMental.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getResultColor(entry.result)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Wins with High Attacking</div>
              <div className="text-2xl font-bold text-green-500">
                {ratings.filter(r => r.result.includes('W') && r.attacking_rating >= 7).length}
              </div>
              <div className="text-xs text-muted-foreground">
                / {ratings.filter(r => r.attacking_rating >= 7).length} high attacking games
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Clean Sheets with High Defensive</div>
              <div className="text-2xl font-bold text-blue-500">
                {ratings.filter(r => !r.result.includes('L') && r.defensive_rating >= 7).length}
              </div>
              <div className="text-xs text-muted-foreground">
                / {ratings.filter(r => r.defensive_rating >= 7).length} high defensive games
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Average Overall Rating</div>
              <div className="text-2xl font-bold">
                {(ratings.reduce((sum, r) => sum + r.overall_performance, 0) / ratings.length).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                across {ratings.length} matches
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
