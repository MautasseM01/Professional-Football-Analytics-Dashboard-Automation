
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackToTopButton } from "@/components/BackToTopButton";
import { Filter, AlertCircle, RefreshCw, Menu } from "lucide-react";
import { PassingNetwork } from "@/components/PassingNetwork";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TacticalFormationImageView } from "@/components/TacticalFormationImageView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
                  Analyze team passing networks and tactical patterns
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
            <div className={cn(
              "grid gap-4 sm:gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
            )}>
              {/* Mobile-optimized Filters */}
              <Card className={cn(isMobile ? "order-2" : "lg:col-span-1", "bg-club-dark-gray border-club-gold/20")}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-club-gold">Filters</CardTitle>
                  <CardDescription className="text-sm text-club-light-gray/70">Select match and filter options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
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
                        className={cn(
                          "w-full bg-club-black border-club-gold/30 text-club-light-gray",
                          isMobile && "min-h-[44px]"
                        )}
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
                      className={cn(
                        "justify-start",
                        isMobile && "grid grid-cols-2 gap-2 w-full"
                      )}
                    >
                      <ToggleGroupItem 
                        value="all" 
                        aria-label="All directions"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        All
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="forward" 
                        aria-label="Forward passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        Forward
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="backward" 
                        aria-label="Backward passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        Backward
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="sideways" 
                        aria-label="Sideways passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
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
                      className={cn(
                        "justify-start",
                        isMobile && "grid grid-cols-2 gap-2 w-full"
                      )}
                    >
                      <ToggleGroupItem 
                        value="all" 
                        aria-label="All passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        All
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="successful" 
                        aria-label="Successful passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        Successful
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="unsuccessful" 
                        aria-label="Unsuccessful passes"
                        className={cn(isMobile && "min-h-[44px] flex-1", "data-[state=on]:bg-club-gold/20")}
                      >
                        Unsuccessful
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Mobile-optimized Error Display */}
                  {imageLoadingError && (
                    <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">Image Loading Issues</span>
                      </div>
                      <TouchFeedbackButton
                        onClick={handleImageRetry}
                        variant="outline"
                        size="sm"
                        className="w-full min-h-[44px] text-sm"
                        hapticType="medium"
                      >
                        <RefreshCw size={14} className="mr-2" />
                        Retry Loading Images
                      </TouchFeedbackButton>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mobile-optimized Passing Network */}
              <Card className={cn(
                "relative bg-club-dark-gray border-club-gold/20",
                isMobile ? "order-1 min-h-[500px]" : "lg:col-span-3 h-[700px]"
              )}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold">Passing Network</CardTitle>
                  <CardDescription className="text-sm text-club-light-gray/70">
                    Player positioning and passing connections
                  </CardDescription>
                </CardHeader>
                <CardContent className={cn(
                  isMobile ? "h-[450px] p-2" : "h-[600px] p-6"
                )}>
                  {isLoadingMatches ? (
                    <LoadingOverlay isLoading={true} />
                  ) : (
                    selectedMatch ? (
                      <PassingNetwork 
                        matchId={selectedMatch} 
                        passDirectionFilter={passDirectionFilter}
                        passOutcomeFilter={passOutcomeFilter}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-club-light-gray">
                        <div className="text-center space-y-2">
                          <p className={cn(
                            "font-medium",
                            isMobile ? "text-base" : "text-lg"
                          )}>
                            Select a match to view the passing network
                          </p>
                          <p className="text-sm opacity-75">
                            Choose from the filters above
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mobile-optimized Tactical Formation Images Section */}
            {selectedMatch && (
              <Card className="mt-4 sm:mt-6 bg-club-dark-gray border-club-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-club-gold">Tactical Formation Analysis</CardTitle>
                  <CardDescription className="text-sm text-club-light-gray/70">
                    Formation diagrams and tactical insights for the selected match
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <TacticalFormationImageView
                    matchId={selectedMatch}
                    onImageError={handleImageError}
                    onImageRetry={handleImageRetry}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
};

export default TeamTacticalAnalysis;
