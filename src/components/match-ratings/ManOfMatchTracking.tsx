
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchRating } from "@/hooks/use-match-ratings";
import { Award, Calendar, Trophy } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ManOfMatchTrackingProps {
  ratings: MatchRating[];
}

export const ManOfMatchTracking = ({ ratings }: ManOfMatchTrackingProps) => {
  if (ratings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No man of the match data available</p>
        </CardContent>
      </Card>
    );
  }

  // Extract man of the match data
  const motmData = ratings
    .filter(r => r.man_of_match_name)
    .map(r => ({
      name: r.man_of_match_name!,
      match: r.opponent,
      date: r.match_date,
      result: r.result,
      overallRating: r.overall_performance
    }));

  // Count MOTM awards by player
  const motmCounts = motmData.reduce((acc, motm) => {
    acc[motm.name] = (acc[motm.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const motmChartData = Object.entries(motmCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const recentMotm = motmData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* MOTM Leaders Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Man of the Match Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={motmChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'MOTM Awards']}
                  labelFormatter={(label) => `Player: ${label}`}
                />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MOTM Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              MOTM Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-sm text-muted-foreground">Total Awards</div>
                  <div className="text-2xl font-bold">{motmData.length}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-sm text-muted-foreground">Unique Winners</div>
                  <div className="text-2xl font-bold">{Object.keys(motmCounts).length}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Top Performers</h4>
                {motmChartData.slice(0, 5).map((player) => (
                  <div key={player.name} className="flex items-center justify-between p-2 rounded border">
                    <span className="font-medium">{player.name}</span>
                    <Badge variant="secondary">{player.count} awards</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent MOTM Awards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentMotm.map((motm, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{motm.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {motm.match} • {new Date(motm.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={motm.result.includes('W') ? 'default' : motm.result.includes('D') ? 'secondary' : 'destructive'}>
                      {motm.result}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Rating: {motm.overallRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MOTM Performance Context */}
      <Card>
        <CardHeader>
          <CardTitle>MOTM Performance Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">MOTM in Wins</div>
              <div className="text-2xl font-bold text-green-500">
                {motmData.filter(m => m.result.includes('W')).length}
              </div>
              <div className="text-xs text-muted-foreground">
                {((motmData.filter(m => m.result.includes('W')).length / motmData.length) * 100).toFixed(1)}% of awards
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Average Team Rating with MOTM</div>
              <div className="text-2xl font-bold">
                {(motmData.reduce((sum, m) => sum + m.overallRating, 0) / motmData.length).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                team performance rating
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/20">
              <div className="text-sm text-muted-foreground">Most Productive Month</div>
              <div className="text-2xl font-bold">
                {motmData.length > 0 ? new Date(motmData[0].date).toLocaleDateString('en-US', { month: 'short' }) : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                recent awards
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
