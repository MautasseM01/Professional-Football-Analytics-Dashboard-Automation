
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, AlertCircle, RefreshCw } from "lucide-react";
import { PassingNetwork } from "@/components/PassingNetwork";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TacticalFormationImageView } from "@/components/TacticalFormationImageView";
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
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);

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
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-club-gold">Team Tactical Analysis</h1>
          <p className="text-club-light-gray">
            Analyze team passing networks and tactical patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Select match and filter options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="match-select">Select Match</Label>
                <Select 
                  value={selectedMatch?.toString() || ''} 
                  onValueChange={(value) => setSelectedMatch(parseInt(value))}
                  disabled={isLoadingMatches}
                >
                  <SelectTrigger id="match-select" className="w-full">
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

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter size={16} />
                  Pass Direction
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={passDirectionFilter}
                  onValueChange={(value) => value && setPassDirectionFilter(value)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="all" aria-label="All directions">All</ToggleGroupItem>
                  <ToggleGroupItem value="forward" aria-label="Forward passes">Forward</ToggleGroupItem>
                  <ToggleGroupItem value="backward" aria-label="Backward passes">Backward</ToggleGroupItem>
                  <ToggleGroupItem value="sideways" aria-label="Sideways passes">Sideways</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter size={16} />
                  Pass Outcome
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={passOutcomeFilter}
                  onValueChange={(value) => value && setPassOutcomeFilter(value)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="all" aria-label="All passes">All</ToggleGroupItem>
                  <ToggleGroupItem value="successful" aria-label="Successful passes">Successful</ToggleGroupItem>
                  <ToggleGroupItem value="unsuccessful" aria-label="Unsuccessful passes">Unsuccessful</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {imageLoadingError && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle size={16} />
                    <span className="text-sm">Image Loading Issues</span>
                  </div>
                  <button
                    onClick={handleImageRetry}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Retry Loading Images
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 h-[700px] relative">
            <CardHeader>
              <CardTitle>Passing Network</CardTitle>
              <CardDescription>
                Player positioning and passing connections
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
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
                    Select a match to view the passing network
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tactical Formation Images Section */}
        {selectedMatch && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tactical Formation Analysis</CardTitle>
              <CardDescription>
                Formation diagrams and tactical insights for the selected match
              </CardDescription>
            </CardHeader>
            <CardContent>
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
