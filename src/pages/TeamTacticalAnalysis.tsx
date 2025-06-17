
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Filter, AlertCircle, RefreshCw, Menu } from "lucide-react";
import { PassingNetwork } from "@/components/PassingNetwork";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TacticalFormationImageView } from "@/components/TacticalFormationImageView";
import { MatchRatingsDashboard } from "@/components/match-ratings/MatchRatingsDashboard";
import { PlayerMatchRatings } from "@/components/match-ratings/PlayerMatchRatings";
import { PerformanceCorrelation } from "@/components/match-ratings/PerformanceCorrelation";
import { ManOfMatchTracking } from "@/components/match-ratings/ManOfMatchTracking";
import { OppositionAnalysis } from "@/components/match-ratings/OppositionAnalysis";
import { SeasonPerformanceTrends } from "@/components/match-ratings/SeasonPerformanceTrends";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMatchRatings } from "@/hooks/use-match-ratings";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Match {
  id: number;
  date: string;
  opponent: string;
  location: string;
  result: string;
}

const TeamTacticalAnalysis = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [passDirectionFilter, setPassDirectionFilter] = useState<string>("all");
  const [passOutcomeFilter, setPassOutcomeFilter] = useState<string>("all");
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  const isMobile = useIsMobile();

  const { data: matches, isLoading: isLoadingMatches, refetch: refetchMatches } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("date", { ascending: false });
        
        if (error) {
          toast.error("Failed to load matches");
          throw error;
        }
        
        return (data as Match[]) || [];
      } catch (error) {
        console.error("Error fetching matches:", error);
        return [] as Match[];
      }
    }
  });

  const { ratings, loading: ratingsLoading, error: ratingsError } = useMatchRatings(undefined, selectedLimit);

  useEffect(() => {
    if (matches && matches.length > 0 && !selectedMatch) {
      setSelectedMatch(matches[0].id);
    }
  }, [matches, selectedMatch]);

  const handleRefresh = () => {
    console.log("Manual refresh triggered for tactical analysis");
    refetchMatches();
    toast.success("Data refreshed successfully");
  };

  const handleImageError = () => {
    setImageLoadingError(true);
    toast.error("Failed to load tactical formation images. Using fallback display.");
  };

  const handleImageRetry = () => {
    setImageLoadingError(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-[calc(100%-2rem)] mx-auto">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-[23px] gap-2 sm:gap-4">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-ios-headline font-bold text-club-gold dark:text-club-gold truncate">
                  Team Tactical Analysis
                </h1>
                <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate">
                  Analyze team passing networks, tactical patterns, and match ratings
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  onClick={handleRefresh} 
                  title="Refresh data" 
                  hapticType="medium"
                >
                  <RefreshCw size={14} className="sm:hidden text-club-gold" />
                  <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                  <RefreshCw size={18} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  title="Toggle sidebar" 
                  hapticType="light"
                >
                  <Menu size={16} className="sm:hidden text-club-gold" />
                  <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                  <Menu size={20} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
              </div>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Filters Section */}
            <Card className="bg-club-dark-gray/50 border-club-gold/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-club-gold" />
                  <h2 className="text-lg font-semibold text-club-gold">Filters</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Match Selection */}
                <div className="space-y-2">
                  <Label htmlFor="match-select" className="text-sm font-medium text-club-light-gray">Select Match</Label>
                  <Select 
                    value={selectedMatch?.toString() || ''} 
                    onValueChange={(value) => setSelectedMatch(parseInt(value))}
                    disabled={isLoadingMatches}
                  >
                    <SelectTrigger 
                      id="match-select" 
                      className="w-full bg-club-black border-club-gold/30 text-club-light-gray min-h-[44px]"
                    >
                      <SelectValue placeholder="Select a match" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
                      {matches?.map(match => (
                        <SelectItem key={match.id} value={match.id.toString()}>
                          {match.date.substring(0, 10)} - {match.opponent} ({match.result})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Limit Selection for Match Ratings */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-club-light-gray">Analysis Depth</Label>
                  <Select value={selectedLimit.toString()} onValueChange={(value) => setSelectedLimit(parseInt(value))}>
                    <SelectTrigger className="w-full bg-club-black border-club-gold/30 text-club-light-gray min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
                      <SelectItem value="5">Last 5 matches</SelectItem>
                      <SelectItem value="10">Last 10 matches</SelectItem>
                      <SelectItem value="15">Last 15 matches</SelectItem>
                      <SelectItem value="20">Last 20 matches</SelectItem>
                      <SelectItem value="50">All matches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pass Direction Filter */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium text-club-light-gray">
                    <Filter size={16} />
                    Pass Direction
                  </Label>
                  <ToggleGroup 
                    type="single" 
                    value={passDirectionFilter}
                    onValueChange={(value) => value && setPassDirectionFilter(value)}
                    className="flex flex-wrap gap-2 w-full justify-start"
                  >
                    <ToggleGroupItem 
                      value="all" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      All Directions
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="forward" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      Forward
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="backward" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      Backward
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="sideways" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      Sideways
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Pass Outcome Filter */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium text-club-light-gray">
                    <Filter size={16} />
                    Pass Outcome
                  </Label>
                  <ToggleGroup 
                    type="single" 
                    value={passOutcomeFilter}
                    onValueChange={(value) => value && setPassOutcomeFilter(value)}
                    className="flex flex-wrap gap-2 w-full justify-start"
                  >
                    <ToggleGroupItem 
                      value="all" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      All Outcomes
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="completed" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      Completed
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="incomplete" 
                      className="bg-club-black border-club-gold/30 text-club-light-gray data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold min-h-[44px] px-4"
                    >
                      Incomplete
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>

            {/* Main Analysis Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-club-dark-gray/50 border-club-gold/20 flex-wrap h-auto p-1">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Season Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="network" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Passing Network
                </TabsTrigger>
                <TabsTrigger 
                  value="players" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Player Ratings
                </TabsTrigger>
                <TabsTrigger 
                  value="correlation" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Correlations
                </TabsTrigger>
                <TabsTrigger 
                  value="motm" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  MOTM Tracking
                </TabsTrigger>
                <TabsTrigger 
                  value="opposition" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Opposition
                </TabsTrigger>
                <TabsTrigger 
                  value="formation" 
                  className="data-[state=active]:bg-club-gold/20 data-[state=active]:text-club-gold text-responsive-sm px-3 py-2"
                >
                  Formation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {ratingsLoading ? (
                  <LoadingOverlay isLoading={true} />
                ) : ratingsError ? (
                  <Card className="bg-club-dark-gray/50 border-club-gold/20">
                    <CardContent className="py-12">
                      <div className="text-center space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                        <div>
                          <h3 className="text-lg font-semibold text-red-500">Failed to Load Data</h3>
                          <p className="text-club-light-gray/70">{ratingsError}</p>
                        </div>
                        <TouchFeedbackButton 
                          onClick={handleRefresh}
                          variant="outline"
                          className="border-club-gold/30 text-club-gold hover:bg-club-gold/10"
                        >
                          Retry
                        </TouchFeedbackButton>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <MatchRatingsDashboard ratings={ratings || []} />
                )}
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                {ratingsLoading ? (
                  <LoadingOverlay isLoading={true} />
                ) : (
                  <SeasonPerformanceTrends ratings={ratings || []} />
                )}
              </TabsContent>

              <TabsContent value="network" className="space-y-6">
                {selectedMatch ? (
                  <PassingNetwork 
                    matchId={selectedMatch}
                    passDirectionFilter={passDirectionFilter}
                    passOutcomeFilter={passOutcomeFilter}
                  />
                ) : (
                  <Card className="bg-club-dark-gray/50 border-club-gold/20">
                    <CardContent className="py-12">
                      <p className="text-center text-club-light-gray/70">Please select a match to view passing network</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="players" className="space-y-6">
                <PlayerMatchRatings ratings={ratings || []} />
              </TabsContent>

              <TabsContent value="correlation" className="space-y-6">
                <PerformanceCorrelation ratings={ratings || []} />
              </TabsContent>

              <TabsContent value="motm" className="space-y-6">
                <ManOfMatchTracking ratings={ratings || []} />
              </TabsContent>

              <TabsContent value="opposition" className="space-y-6">
                <OppositionAnalysis ratings={ratings || []} />
              </TabsContent>

              <TabsContent value="formation" className="space-y-6">
                {selectedMatch ? (
                  <TacticalFormationImageView 
                    matchId={selectedMatch}
                    onImageError={handleImageError}
                    onImageRetry={handleImageRetry}
                  />
                ) : (
                  <Card className="bg-club-dark-gray/50 border-club-gold/20">
                    <CardContent className="py-12">
                      <p className="text-center text-club-light-gray/70">Please select a match to view tactical formation</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default TeamTacticalAnalysis;
