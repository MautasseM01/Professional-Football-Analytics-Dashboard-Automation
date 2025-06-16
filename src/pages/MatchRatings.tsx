
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { MatchRatingsDashboard } from "@/components/match-ratings/MatchRatingsDashboard";
import { PlayerMatchRatings } from "@/components/match-ratings/PlayerMatchRatings";
import { PerformanceCorrelation } from "@/components/match-ratings/PerformanceCorrelation";
import { ManOfMatchTracking } from "@/components/match-ratings/ManOfMatchTracking";
import { OppositionAnalysis } from "@/components/match-ratings/OppositionAnalysis";
import { SeasonPerformanceTrends } from "@/components/match-ratings/SeasonPerformanceTrends";
import { useMatchRatings } from "@/hooks/use-match-ratings";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";

const MatchRatings = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>("2024-25");
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  
  const { ratings, loading, error } = useMatchRatings(undefined, selectedLimit);

  if (loading) return <ChartLoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Match Ratings Analysis
              </h1>
              <p className="text-muted-foreground">
                Comprehensive team and player performance ratings
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLimit.toString()} onValueChange={(value) => setSelectedLimit(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {ratings.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="secondary">
                {ratings.length} matches analyzed
              </Badge>
              <Badge variant="outline">
                Avg Rating: {(ratings.reduce((sum, r) => sum + r.overall_performance, 0) / ratings.length).toFixed(1)}
              </Badge>
            </div>
          )}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="players">Player Ratings</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
            <TabsTrigger value="motm">Man of Match</TabsTrigger>
            <TabsTrigger value="opposition">Opposition</TabsTrigger>
            <TabsTrigger value="trends">Season Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MatchRatingsDashboard ratings={ratings} />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <PlayerMatchRatings ratings={ratings} />
          </TabsContent>

          <TabsContent value="correlation" className="space-y-6">
            <PerformanceCorrelation ratings={ratings} />
          </TabsContent>

          <TabsContent value="motm" className="space-y-6">
            <ManOfMatchTracking ratings={ratings} />
          </TabsContent>

          <TabsContent value="opposition" className="space-y-6">
            <OppositionAnalysis ratings={ratings} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <SeasonPerformanceTrends ratings={ratings} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MatchRatings;
