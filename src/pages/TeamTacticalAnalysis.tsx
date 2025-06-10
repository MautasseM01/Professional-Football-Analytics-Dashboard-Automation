
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { Filter, AlertCircle, RefreshCw } from "lucide-react";
import { PassingNetwork } from "@/components/PassingNetwork";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TacticalFormationImageView } from "@/components/TacticalFormationImageView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackToTopButton } from "@/components/BackToTopButton";
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
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [passDirectionFilter, setPassDirectionFilter] = useState<string>("all");
  const [passOutcomeFilter, setPassOutcomeFilter] = useState<string>("all");
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const { data: matches, isLoading: isLoadingMatches } = useQuery({
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

  const handleImageError = () => {
    setImageLoadingError(true);
    toast.error("Failed to load tactical formation images. Using fallback display.");
  };

  const handleImageRetry = () => {
    setImageLoadingError(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-club-gold">Team Tactical Analysis</h1>
          <p className="text-sm sm:text-base text-club-light-gray">
            Analyze team passing networks and tactical patterns
          </p>
        </div>

        <div className={cn(
          "grid gap-4 sm:gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
        )}>
          {/* Mobile-optimized Filters */}
          <Card className={cn(isMobile ? "order-2" : "lg:col-span-1")}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription className="text-sm">Select match and filter options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Match Selection */}
              <div className="space-y-2">
                <Label htmlFor="match-select" className="text-sm font-medium">Select Match</Label>
                <Select 
                  value={selectedMatch?.toString() || ''} 
                  onValueChange={(value) => setSelectedMatch(parseInt(value))}
                  disabled={isLoadingMatches}
                >
                  <SelectTrigger 
                    id="match-select" 
                    className={cn(
                      "w-full",
                      isMobile && "min-h-[44px]"
                    )}
                  >
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label className="flex items-center gap-2 text-sm font-medium">
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
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="forward" 
                    aria-label="Forward passes"
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    Forward
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="backward" 
                    aria-label="Backward passes"
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    Backward
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="sideways" 
                    aria-label="Sideways passes"
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    Sideways
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Pass Outcome Filter */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
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
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="successful" 
                    aria-label="Successful passes"
                    className={cn(isMobile && "min-h-[44px] flex-1")}
                  >
                    Successful
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="unsuccessful" 
                    aria-label="Unsuccessful passes"
                    className={cn(isMobile && "min-h-[44px] flex-1")}
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
            "relative",
            isMobile ? "order-1 min-h-[500px]" : "lg:col-span-3 h-[700px]"
          )}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Passing Network</CardTitle>
              <CardDescription className="text-sm">
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
          <Card className="mt-4 sm:mt-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Tactical Formation Analysis</CardTitle>
              <CardDescription className="text-sm">
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

      <BackToTopButton />
    </DashboardLayout>
  );
};

export default TeamTacticalAnalysis;
