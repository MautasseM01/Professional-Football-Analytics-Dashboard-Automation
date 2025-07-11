import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { formatNumber, formatDuration, formatPercentage, formatDistance } from '@/utils/formatters';
import { 
  Brain, 
  Activity, 
  Users, 
  Target, 
  Clock, 
  Camera, 
  TrendingUp, 
  Download,
  FileText,
  Share,
  BarChart3,
  Zap,
  Timer,
  Eye,
  Gauge,
  Trophy,
  MapPin
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnalysisData {
  match_id: string;
  date: string;
  analysis_method: string;
  video_source: string;
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
  const [selectedMethod, setSelectedMethod] = useState<string>('yolo');

  useEffect(() => {
    fetchAnalysisData();
  }, [selectedMethod]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const { data: analysisData, error } = await supabase
        .from('match_analysis')
        .select('*')
        .eq('analysis_method', selectedMethod)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (analysisData) {
        setData({
          ...analysisData,
          analysis_data: analysisData.analysis_data as AnalysisData['analysis_data']
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    
    const csvContent = [
      ['Player', 'Position', 'Distance (km)', 'Sprints', 'Pass Accuracy (%)'],
      ...data.analysis_data.players.map(player => [
        player.name,
        player.position,
        player.distance_covered.toString(),
        player.sprint_count.toString(),
        player.pass_completion.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match_analysis_${data.match_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Player stats exported to CSV file.",
    });
  };

  const generatePDFReport = () => {
    toast({
      title: "PDF Generation",
      description: "PDF report generation coming soon!",
    });
  };

  const sharePlayerStats = () => {
    toast({
      title: "Share Feature",
      description: "Player stats sharing coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAnalysisData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analysis Data</h3>
            <p className="text-muted-foreground">No match analysis data found. Upload and analyze a match first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { team_stats, players, key_events, processing_stats } = data.analysis_data;
  const topPerformers = [...players]
    .sort((a, b) => b.distance_covered - a.distance_covered)
    .slice(0, 3);

  const eventColors = {
    goal: 'bg-green-500',
    shot: 'bg-blue-500',
    yellow_card: 'bg-yellow-500',
    red_card: 'bg-red-500',
    substitution: 'bg-orange-500',
    kickoff: 'bg-gray-500'
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Match Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Match analyzed on {new Date(data.date).toLocaleDateString()} using{' '}
              <Badge variant="outline" className="ml-1">
                {data.analysis_method.toUpperCase()}
              </Badge>
              {' '}via {data.video_source.replace('_', ' ')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={generatePDFReport}>
              <FileText className="h-4 w-4 mr-2" />
              PDF Report
            </Button>
            <Button variant="outline" size="sm" onClick={sharePlayerStats}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Analysis Method Comparison */}
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
          <TabsList>
            <TabsTrigger value="yolo">YOLO (Free)</TabsTrigger>
            <TabsTrigger value="once_sport">Once Sport (€13/mo)</TabsTrigger>
            <TabsTrigger value="google_cloud">Google Cloud (€20-50/mo)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Possession</p>
                <p className="text-2xl font-bold">{formatPercentage(team_stats.possession)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Formation</p>
                <p className="text-2xl font-bold">{team_stats.formation}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">{formatDistance(team_stats.total_distance)}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Accuracy</p>
                <p className="text-2xl font-bold">{formatPercentage(team_stats.passing_accuracy)}</p>
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
            <Brain className="h-5 w-5" />
            AI Performance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Players Tracked</p>
                <p className="text-xl font-bold">{formatNumber(processing_stats.total_detections)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Players per Frame</p>
                <p className="text-xl font-bold">{processing_stats.avg_players_detected.toFixed(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Video Duration</p>
                <p className="text-xl font-bold">{formatDuration(processing_stats.duration_analyzed)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Gauge className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-xl font-bold">{formatPercentage(processing_stats.detection_confidence * 100)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Player Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Sprints</TableHead>
                      <TableHead>Pass %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player, index) => {
                      const isTopPerformer = topPerformers.includes(player);
                      return (
                        <TableRow key={player.name} className={isTopPerformer ? 'bg-primary/5' : ''}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {player.name}
                              {isTopPerformer && <Trophy className="h-4 w-4 text-primary" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{player.position}</Badge>
                          </TableCell>
                          <TableCell>{formatDistance(player.distance_covered)}</TableCell>
                          <TableCell>{player.sprint_count}</TableCell>
                          <TableCell>{formatPercentage(player.pass_completion)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Events Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Match Events Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {key_events.map((event, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${eventColors[event.type as keyof typeof eventColors] || 'bg-gray-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {event.type.replace('_', ' ')}
                        {event.player && ` - ${event.player}`}
                      </span>
                      <Badge variant="outline">{event.minute}'</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Savings Calculator */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="h-5 w-5" />
            Cost Savings Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Solution</p>
              <p className="text-2xl font-bold text-green-600">€0-39/month</p>
              <p className="text-xs text-muted-foreground">Our AI Analytics</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Veo Analytics</p>
              <p className="text-2xl font-bold text-red-600">€65+/month</p>
              <p className="text-xs text-muted-foreground">External Provider</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
              <p className="text-2xl font-bold text-green-600">€26-65</p>
              <p className="text-xs text-muted-foreground">Annual: €312-780</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Player Heatmap (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gradient-to-br from-blue-100 to-red-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Heatmap visualization will show player movement patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};