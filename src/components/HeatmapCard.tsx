
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
    <Card className="border-club-gold/20 bg-club-dark-gray md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-club-gold">Performance Heatmap</CardTitle>
          <CardDescription>Player's match positioning and movement</CardDescription>
        </div>
        <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
          <SelectTrigger className="w-[180px] bg-club-black text-white border-club-gold/30">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent className="bg-club-dark-gray text-white border-club-gold/30">
            <SelectItem value="Full Match">Full Match</SelectItem>
            <SelectItem value="First Half">First Half</SelectItem>
            <SelectItem value="Second Half">Second Half</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {player.heatmapUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              {/* Football pitch SVG */}
              <svg 
                className="absolute inset-0 w-full h-full z-10" 
                viewBox="0 0 1050 680" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
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
                <div className="flex flex-col items-center justify-center h-full bg-club-black/50 p-4 z-20 relative">
                  <ImageOff className="text-club-gold mb-2" size={36} />
                  <p className="text-center text-club-gold mb-2">Unable to load heatmap image</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetImageError}
                      className="border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                    >
                      Retry Original
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={tryAlternativeUrl}
                      className="border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
                    >
                      Try Thumbnail
                    </Button>
                  </div>
                  <p className="text-xs text-club-light-gray/60 mt-4 text-center">
                    The image cannot be loaded due to CORS restrictions from Google Drive.
                    <br/>Try uploading the image to a CORS-enabled image hosting service.
                  </p>
                </div>
              ) : (
                <>
                  <img 
                    src={imageUrl || player.heatmapUrl} 
                    alt={`${player.name} heatmap`}
                    className="object-cover w-full h-full opacity-80 z-0"
                    crossOrigin="anonymous"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                </>
              )}
              <div className="absolute bottom-2 right-2 bg-club-black/70 text-xs px-2 py-1 rounded z-20">
                {player.name}'s Heatmap • {selectedPeriod}
              </div>
            </div>
            
            {/* Heatmap Color Legend */}
            <div className="flex flex-col space-y-1">
              <p className="text-xs text-club-light-gray">Intensity Scale:</p>
              <div className="flex items-center gap-1">
                <div className="h-4 flex-1 rounded-md" style={{
                  background: `linear-gradient(to right, ${colorScaleStops.map(s => s.color).join(', ')})`
                }}></div>
              </div>
              <div className="flex justify-between px-1">
                {colorScaleStops.filter(stop => stop.label).map((stop, i) => (
                  <span key={i} className="text-xs text-club-light-gray">{stop.label}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Alert className="bg-club-gold/10 border-club-gold/30">
            <AlertDescription>
              Heatmap not available for this player
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
