
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import { PassingNetwork } from "@/components/PassingNetwork";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackToTopButton } from "@/components/BackToTopButton";

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
        
        // Ensure the data conforms to our Match interface
        return (data as Match[]) || [];
      } catch (error) {
        console.error("Error fetching matches:", error);
        return [] as Match[];
      }
    }
  });

  useEffect(() => {
    // Set the first match as selected when data loads
    if (matches && matches.length > 0 && !selectedMatch) {
      setSelectedMatch(matches[0].id);
    }
  }, [matches, selectedMatch]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-club-gold">Team Tactical Analysis</h1>
          <p className="text-club-light-gray text-sm sm:text-base">
            Analyze team passing networks and tactical patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters Card - Full width on mobile, 1 column on large screens */}
          <Card className="lg:col-span-1 order-1 lg:order-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
              <CardDescription className="text-sm">Select match and filter options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="match-select" className="text-sm font-medium">Select Match</Label>
                <Select 
                  value={selectedMatch?.toString() || ''} 
                  onValueChange={(value) => setSelectedMatch(parseInt(value))}
                  disabled={isLoadingMatches}
                >
                  <SelectTrigger id="match-select" className="w-full h-10 text-sm">
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 z-50">
                    {matches?.map(match => (
                      <SelectItem key={match.id} value={match.id.toString()} className="text-sm">
                        {match.date.substring(0, 10)} - {match.opponent} ({match.result})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Filter size={16} />
                  Pass Direction
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={passDirectionFilter}
                  onValueChange={(value) => value && setPassDirectionFilter(value)}
                  className="grid grid-cols-2 gap-2 w-full"
                >
                  <ToggleGroupItem 
                    value="all" 
                    aria-label="All directions"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="forward" 
                    aria-label="Forward passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Forward
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="backward" 
                    aria-label="Backward passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Backward
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="sideways" 
                    aria-label="Sideways passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Sideways
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Filter size={16} />
                  Pass Outcome
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={passOutcomeFilter}
                  onValueChange={(value) => value && setPassOutcomeFilter(value)}
                  className="grid grid-cols-1 gap-2 w-full"
                >
                  <ToggleGroupItem 
                    value="all" 
                    aria-label="All passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="successful" 
                    aria-label="Successful passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Successful
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="unsuccessful" 
                    aria-label="Unsuccessful passes"
                    className="h-9 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Unsuccessful
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          {/* Passing Network Card - Full width on mobile, 3 columns on large screens */}
          <Card className="lg:col-span-3 order-2 lg:order-2 min-h-[400px] sm:min-h-[500px] lg:h-[700px] relative">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Passing Network</CardTitle>
              <CardDescription className="text-sm">
                Player positioning and passing connections
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] sm:h-[450px] lg:h-[600px] p-2 sm:p-4">
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
                  <div className="flex items-center justify-center h-full text-club-light-gray text-center p-4">
                    <p className="text-sm sm:text-base">Select a match to view the passing network</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </DashboardLayout>
  );
};

export default TeamTacticalAnalysis;
