
import { useState, useEffect } from "react";
import { Player } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getGoogleDriveThumbnailUrl } from "@/lib/image-utils";

interface HeatmapCardProps {
  player: Player;
}

type MatchPeriod = 'First Half' | 'Second Half' | 'Full Match';

// Color scale for the heatmap legend
const colorScaleStops = [
  { color: "#F2FCE2", label: "Low" },
  { color: "#FEF7CD", label: "" },
  { color: "#FEC6A1", label: "" },
  { color: "#F97316", label: "" },
  { color: "#ea384c", label: "High" }
];

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<MatchPeriod>('Full Match');
  
  // Reset state when player changes to ensure image corresponds to current player
  useEffect(() => {
    console.log(`Player in HeatmapCard: ${player.name}, Setting image URL to: ${player.heatmapUrl}`);
    // Reset the image error state when player changes
    setImageError(false);
    // Set the image URL directly from the player data
    setImageUrl(player.heatmapUrl);
  }, [player.id]); // Using player.id ensures this runs only when the selected player changes

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading heatmap image:", e);
    console.log("Failed URL:", imageUrl);
    setImageError(true);
    toast({
      title: "Image loading error",
      description: "Could not load the player heatmap image",
      variant: "destructive"
    });
  };

  const tryAlternativeUrl = () => {
    // Try using an image proxy service or thumbnail
    const thumbnailUrl = getGoogleDriveThumbnailUrl(player.heatmapUrl);
    if (thumbnailUrl) {
      console.log(`Trying thumbnail URL for ${player.name}:`, thumbnailUrl);
      setImageUrl(thumbnailUrl);
      setImageError(false);
    }
  };

  const resetImageError = () => {
    console.log(`Resetting to original URL for ${player.name}:`, player.heatmapUrl);
    setImageUrl(player.heatmapUrl);
    setImageError(false);
  };

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as MatchPeriod);
    // In a real app, this would trigger loading a different heatmap based on the period
    console.log(`Selected period changed to: ${period}`);
    // For demonstration, we simulate changing the image - in a real app you'd fetch different data
    toast({
      title: "Period Changed",
      description: `Heatmap updated to show ${period} data`,
    });
  };

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray w-full h-full flex flex-col">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4 flex-shrink-0">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-club-gold text-lg sm:text-xl lg:text-2xl font-semibold">
              Performance Heatmap
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-club-light-gray/70 mt-1">
              Player's match positioning and movement patterns
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
              <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] bg-club-black text-white border-club-gold/30 h-10 focus:ring-club-gold/50">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent className="bg-club-dark-gray text-white border-club-gold/30 z-50">
                <SelectItem value="Full Match">Full Match</SelectItem>
                <SelectItem value="First Half">First Half</SelectItem>
                <SelectItem value="Second Half">Second Half</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 pt-0 flex-1 flex flex-col min-h-0">
        {player.heatmapUrl ? (
          <div className="space-y-4 flex-1 flex flex-col">
            <div 
              className="relative w-full rounded-lg overflow-hidden bg-green-800/20 border border-green-700/30 flex-1"
              style={{ 
                aspectRatio: '16/10',
                minHeight: '300px',
                maxHeight: '500px'
              }}
            >
              {/* Football pitch SVG overlay */}
              <svg 
                className="absolute inset-0 w-full h-full z-10 pointer-events-none" 
                viewBox="0 0 1050 680" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Pitch outline */}
                <rect x="50" y="50" width="950" height="580" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                
                {/* Center line */}
                <line x1="525" y1="50" x2="525" y2="630" stroke="#FFFFFF" strokeWidth="2" />
                
                {/* Center circle */}
                <circle cx="525" cy="340" r="91.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <circle cx="525" cy="340" r="2" fill="#FFFFFF" />
                
                {/* Penalty areas */}
                <rect x="50" y="195" width="165" height="290" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <rect x="835" y="195" width="165" height="290" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                
                {/* Goal areas */}
                <rect x="50" y="265" width="55" height="150" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <rect x="945" y="265" width="55" height="150" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                
                {/* Penalty spots */}
                <circle cx="165" cy="340" r="2" fill="#FFFFFF" />
                <circle cx="885" cy="340" r="2" fill="#FFFFFF" />
                
                {/* Corner arcs */}
                <path d="M60 60 A 10 10 0 0 1 50 50" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M990 60 A 10 10 0 0 0 1000 50" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M60 620 A 10 10 0 0 0 50 630" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <path d="M990 620 A 10 10 0 0 1 1000 630" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              </svg>
              
              {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-club-black/60 p-4 z-20">
                  <ImageOff className="text-club-gold mb-3 w-8 h-8 sm:w-10 sm:h-10" />
                  <p className="text-center text-club-gold mb-3 text-sm sm:text-base font-medium">
                    Unable to load heatmap image
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                    <Button 
                      variant="outline" 
                      onClick={resetImageError}
                      className="border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold text-xs sm:text-sm h-9 flex-1"
                      size="sm"
                    >
                      Retry Original
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={tryAlternativeUrl}
                      className="border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold text-xs sm:text-sm h-9 flex-1"
                      size="sm"
                    >
                      Try Thumbnail
                    </Button>
                  </div>
                  <p className="text-xs text-club-light-gray/60 mt-3 text-center max-w-sm leading-relaxed">
                    The image cannot be loaded due to CORS restrictions from Google Drive. 
                    Try uploading the image to a CORS-enabled image hosting service.
                  </p>
                </div>
              ) : (
                <>
                  <img 
                    src={imageUrl || player.heatmapUrl} 
                    alt={`${player.name} heatmap`}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    crossOrigin="anonymous"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-club-black/80 text-club-light-gray text-xs px-3 py-1.5 rounded-md z-20 font-medium">
                    {player.name}'s Heatmap • {selectedPeriod}
                  </div>
                </>
              )}
            </div>
            
            {/* Heatmap Color Legend */}
            <div className="space-y-2 flex-shrink-0">
              <p className="text-sm font-medium text-club-light-gray">Activity Intensity Scale:</p>
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 flex-1 rounded-md shadow-sm" 
                  style={{
                    background: `linear-gradient(to right, ${colorScaleStops.map(s => s.color).join(', ')})`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-club-light-gray/80">
                {colorScaleStops.filter(stop => stop.label).map((stop, i) => (
                  <span key={i} className="font-medium">{stop.label}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Alert className="bg-club-gold/10 border-club-gold/30 flex-1 flex items-center">
            <AlertDescription className="text-club-light-gray">
              Heatmap visualization not available for this player
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
