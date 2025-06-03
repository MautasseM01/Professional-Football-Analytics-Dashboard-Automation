
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Reset state when player changes to ensure image corresponds to current player
  useEffect(() => {
    console.log(`Player in HeatmapCard: ${player.name}, Setting image URL to: ${player.heatmapUrl}`);
    // Reset the image error state when player changes
    setImageError(false);
    setImageLoaded(false);
    // Set the image URL directly from the player data
    setImageUrl(player.heatmapUrl);
  }, [player.id]); // Using player.id ensures this runs only when the selected player changes

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading heatmap image:", e);
    console.log("Failed URL:", imageUrl);
    setImageError(true);
    setImageLoaded(false);
    toast({
      title: "Image loading error",
      description: "Could not load the player heatmap image",
      variant: "destructive"
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const tryAlternativeUrl = () => {
    // Try using an image proxy service or thumbnail
    const thumbnailUrl = getGoogleDriveThumbnailUrl(player.heatmapUrl);
    if (thumbnailUrl) {
      console.log(`Trying thumbnail URL for ${player.name}:`, thumbnailUrl);
      setImageUrl(thumbnailUrl);
      setImageError(false);
      setImageLoaded(false);
    }
  };

  const resetImageError = () => {
    console.log(`Resetting to original URL for ${player.name}:`, player.heatmapUrl);
    setImageUrl(player.heatmapUrl);
    setImageError(false);
    setImageLoaded(false);
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

  // Show football pitch overlay only when there's no image or when there's an error
  const showPitchOverlay = !player.heatmapUrl || imageError || !imageLoaded;

  return (
    <Card className="border-club-gold/20 bg-club-dark-gray w-full h-full flex flex-col">
      <CardHeader className={`flex-shrink-0 ${isMobile ? 'p-3 pb-2' : 'p-4 sm:p-6 pb-3 sm:pb-4'}`}>
        <div className={`flex flex-col ${isMobile ? 'space-y-2' : 'space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4'}`}>
          <div className="min-w-0 flex-1">
            <CardTitle className={`text-club-gold font-semibold ${
              isMobile ? 'text-base' : 'text-lg sm:text-xl lg:text-2xl'
            }`}>
              Performance Heatmap
            </CardTitle>
            <CardDescription className={`text-club-light-gray/70 mt-1 ${
              isMobile ? 'text-xs' : 'text-sm sm:text-base'
            }`}>
              Player's match positioning and movement patterns
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
              <SelectTrigger className={`bg-club-black text-white border-club-gold/30 focus:ring-club-gold/50 ${
                isMobile 
                  ? 'w-full h-9 text-sm' 
                  : 'w-full sm:w-[160px] lg:w-[180px] h-10'
              }`}>
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
      
      <CardContent className={`flex-1 flex flex-col min-h-0 ${isMobile ? 'p-3 pt-0' : 'p-4 sm:p-6 pt-0'}`}>
        {player.heatmapUrl ? (
          <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
            <div 
              className="relative w-full rounded-lg overflow-hidden bg-green-800/20 border border-green-700/30 flex-1"
              style={{ 
                aspectRatio: isMobile ? '4/3' : '16/10',
                minHeight: isMobile ? '200px' : '300px',
                maxHeight: isMobile ? '300px' : '500px'
              }}
            >
              {/* Football pitch SVG overlay - only show when no image or error */}
              {showPitchOverlay && (
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
              )}
              
              {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-club-black/60 p-3 sm:p-4 z-20">
                  <ImageOff className={`text-club-gold mb-2 sm:mb-3 ${isMobile ? 'w-6 h-6' : 'w-8 h-8 sm:w-10 sm:h-10'}`} />
                  <p className={`text-center text-club-gold mb-2 sm:mb-3 font-medium ${
                    isMobile ? 'text-xs' : 'text-sm sm:text-base'
                  }`}>
                    Unable to load heatmap image
                  </p>
                  <div className={`flex gap-2 w-full ${isMobile ? 'flex-col max-w-48' : 'flex-col sm:flex-row max-w-xs'}`}>
                    <Button 
                      variant="outline" 
                      onClick={resetImageError}
                      className={`border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold flex-1 ${
                        isMobile ? 'text-xs h-8' : 'text-xs sm:text-sm h-9'
                      }`}
                      size="sm"
                    >
                      Retry Original
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={tryAlternativeUrl}
                      className={`border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold flex-1 ${
                        isMobile ? 'text-xs h-8' : 'text-xs sm:text-sm h-9'
                      }`}
                      size="sm"
                    >
                      Try Thumbnail
                    </Button>
                  </div>
                  <p className={`text-club-light-gray/60 mt-2 sm:mt-3 text-center max-w-sm leading-relaxed ${
                    isMobile ? 'text-xs' : 'text-xs'
                  }`}>
                    The image cannot be loaded due to CORS restrictions from Google Drive. 
                    Try uploading the image to a CORS-enabled image hosting service.
                  </p>
                </div>
              ) : (
                <>
                  <img 
                    src={imageUrl || player.heatmapUrl} 
                    alt={`${player.name} heatmap`}
                    className="absolute inset-0 w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    referrerPolicy="no-referrer"
                  />
                  {imageLoaded && (
                    <div className={`absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-club-black/80 text-club-light-gray px-2 sm:px-3 py-1 sm:py-1.5 rounded-md z-20 font-medium ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      {player.name}'s Heatmap • {selectedPeriod}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Heatmap Color Legend - only show when image is loaded */}
            {imageLoaded && (
              <div className="space-y-1.5 sm:space-y-2 flex-shrink-0">
                <p className={`font-medium text-club-light-gray ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Activity Intensity Scale:
                </p>
                <div className="flex items-center gap-2">
                  <div 
                    className={`flex-1 rounded-md shadow-sm ${isMobile ? 'h-2' : 'h-3'}`}
                    style={{
                      background: `linear-gradient(to right, ${colorScaleStops.map(s => s.color).join(', ')})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-club-light-gray/80">
                  {colorScaleStops.filter(stop => stop.label).map((stop, i) => (
                    <span key={i} className={`font-medium ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {stop.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert className="bg-club-gold/10 border-club-gold/30 flex-1 flex items-center">
            <AlertDescription className={`text-club-light-gray ${isMobile ? 'text-sm' : ''}`}>
              Heatmap visualization not available for this player
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
