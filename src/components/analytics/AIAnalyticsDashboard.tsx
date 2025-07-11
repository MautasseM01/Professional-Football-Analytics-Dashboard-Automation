import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { Activity, Users, MapPin, Target, Clock, Zap } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

interface AnalysisData {
  match_id: string;
  date: string;
  analysis_method: string;
  processing_time: number;
  analysis_data: {
    team_stats: {
      formation: string;
      possession: number;
      total_distance: number;
      passing_accuracy: number;
    };
    players: Array<{
      name: string;
      position: string;
      distance_covered: number;
      sprint_count: number;
      pass_completion: number;
    }>;
    key_events: Array<{
      type: string;
      minute: number;
      player?: string;
    }>;
    processing_stats: {
      total_detections: number;
      avg_players_detected: number;
      duration_analyzed: number;
      detection_confidence: number;
    };
  };
}

export const AIAnalyticsDashboard = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      const { data: analysisData, error } = await supabase
        .from('match_analysis')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setData(analysisData as unknown as AnalysisData);
    } catch (err) {
      console.error('Error fetching analysis data:', err);
      setError('Failed to load analysis data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="space-y-6">
          <ChartLoadingSkeleton />
          <ChartLoadingSkeleton />
          <ChartLoadingSkeleton />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error || !data) {
    return (
      <ResponsiveLayout>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error || 'No analysis data available'}</p>
          </CardContent>
        </Card>
      </ResponsiveLayout>
    );
  }

  const { team_stats, players, key_events, processing_stats } = data.analysis_data;

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-ios-title1 font-bold text-foreground">AI Match Analysis</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-muted-foreground">
              Match analyzed on {new Date(data.date).toLocaleDateString()}
            </p>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {data.analysis_method.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {data.processing_time}s processing time
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Possession</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {team_stats.possession}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Formation</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {team_stats.formation}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Distance</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {(team_stats.total_distance / 1000).toFixed(1)}km
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pass Accuracy</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {team_stats.passing_accuracy}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI Performance Statistics
            </CardTitle>
            <CardDescription>Computer vision analysis performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(processing_stats.total_detections)}
                </p>
                <p className="text-sm text-muted-foreground">Players Tracked</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {processing_stats.avg_players_detected.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Players/Frame</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {Math.floor(processing_stats.duration_analyzed / 60)}m
                </p>
                <p className="text-sm text-muted-foreground">Duration Analyzed</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {(processing_stats.detection_confidence * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Player Performance Analysis</CardTitle>
            <CardDescription>Individual player statistics from AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Distance (km)</TableHead>
                    <TableHead className="text-right">Sprints</TableHead>
                    <TableHead className="text-right">Pass Accuracy</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    .sort((a, b) => b.distance_covered - a.distance_covered)
                    .map((player, index) => (
                      <TableRow key={player.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                                #{index + 1}
                              </Badge>
                            )}
                            {player.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {(player.distance_covered / 1000).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {player.sprint_count}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {player.pass_completion}%
                        </TableCell>
                        <TableCell>
                          {index < 3 ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              Top Performer
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Standard</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Match Events Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Match Events Timeline</CardTitle>
            <CardDescription>Key events detected during match analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {key_events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'goal' ? 'bg-green-500' :
                    event.type === 'shot' ? 'bg-blue-500' :
                    event.type === 'card' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.minute}'</span>
                      <Badge variant="outline" className="capitalize">
                        {event.type}
                      </Badge>
                      {event.player && (
                        <span className="text-sm text-muted-foreground">
                          {event.player}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};