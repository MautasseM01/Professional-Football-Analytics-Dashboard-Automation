
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
import { ImageOff, ZoomIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getGoogleDriveThumbnailUrl } from "@/lib/image-utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeatmapCardProps {
  player: Player;
}

type MatchPeriod = 'First Half' | 'Second Half' | 'Full Match';

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<MatchPeriod>('Full Match');
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Reset state when player changes to ensure image corresponds to current player
  useEffect(() => {
    console.log(`Player in HeatmapCard: ${player.name}, Setting image URL to: ${player.heatmapUrl}`);
    setImageError(false);
    setImageLoaded(false);
    setImageUrl(player.heatmapUrl);
  }, [player.id]);

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

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as MatchPeriod);
    console.log(`Selected period changed to: ${period}`);
    toast({
      title: "Period Changed",
      description: `Heatmap updated to show ${period} data`,
    });
  };

  // Only show football pitch overlay when there's no image or when there's an error
  const showPitchOverlay = !player.heatmapUrl || imageError;

  return (
    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-2xl w-full h-full flex flex-col">
      <CardHeader className={`flex-shrink-0 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-b border-white/30 dark:border-slate-600/30 ${isMobile ? 'p-3 pb-2' : 'p-4 sm:p-6 pb-3 sm:pb-4'}`}>
        <div className={`flex flex-col ${isMobile ? 'space-y-2' : 'space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4'}`}>
          <div className="min-w-0 flex-1">
            <CardTitle className={`text-gray-900 dark:text-white font-bold tracking-tight ${
              isMobile ? 'text-base' : 'text-lg sm:text-xl lg:text-2xl'
            }`}>
              Performance Heatmap
            </CardTitle>
            <CardDescription className={`text-gray-700 dark:text-gray-300 mt-1 font-medium ${
              isMobile ? 'text-xs' : 'text-sm sm:text-base'
            }`}>
              Player's match positioning and movement patterns
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
              <SelectTrigger className={`bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-lg backdrop-blur-sm ${
                isMobile 
                  ? 'w-full h-11 text-sm min-h-[44px]' 
                  : 'w-full sm:w-[160px] lg:w-[180px] h-10'
              }`}>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-900/95 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 shadow-2xl backdrop-blur-xl z-50">
                <SelectItem value="Full Match" className="hover:bg-blue-50 dark:hover:bg-slate-700 focus:bg-blue-100 dark:focus:bg-slate-600">Full Match</SelectItem>
                <SelectItem value="First Half" className="hover:bg-blue-50 dark:hover:bg-slate-700 focus:bg-blue-100 dark:focus:bg-slate-600">First Half</SelectItem>
                <SelectItem value="Second Half" className="hover:bg-blue-50 dark:hover:bg-slate-700 focus:bg-blue-100 dark:focus:bg-slate-600">Second Half</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`flex-1 flex flex-col min-h-0 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-900/50 ${isMobile ? 'p-3 pt-0' : 'p-4 sm:p-6 pt-0'}`}>
        {player.heatmapUrl ? (
          <div className="flex-1 flex flex-col">
            {/* Player name and period info - positioned above the heatmap */}
            {imageLoaded && (
              <div className={`mb-2 sm:mb-3 text-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/30 dark:border-slate-700/30 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                <span className="text-blue-700 dark:text-blue-300 font-bold">{player.name}'s Heatmap</span>
                <span className="text-gray-500 dark:text-gray-400 mx-3 font-medium">•</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{selectedPeriod}</span>
              </div>
            )}
            
            <div 
              className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300/50 dark:border-green-700/50 shadow-xl flex-1 ${
                isMobile ? 'touch-pan-x touch-pan-y' : ''
              }`}
              style={{ 
                aspectRatio: isMobile ? '4/3' : '16/10',
                minHeight: isMobile ? '200px' : '300px',
                maxHeight: isMobile ? '350px' : '500px'
              }}
            >
              {/* Football pitch SVG overlay - enhanced for better contrast */}
              {showPitchOverlay && (
                <svg 
                  className="absolute inset-0 w-full h-full z-10 pointer-events-none" 
                  viewBox="0 0 1050 680" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Pitch outline with enhanced contrast */}
                  <rect x="50" y="50" width="950" height="580" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <rect x="48" y="48" width="954" height="584" stroke="#ffffff" strokeWidth="2" fill="none" />
                  
                  {/* Center line with double stroke for contrast */}
                  <line x1="525" y1="50" x2="525" y2="630" stroke="#1f2937" strokeWidth="4" />
                  <line x1="525" y1="50" x2="525" y2="630" stroke="#ffffff" strokeWidth="2" />
                  
                  {/* Center circle with enhanced visibility */}
                  <circle cx="525" cy="340" r="91.5" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <circle cx="525" cy="340" r="91.5" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <circle cx="525" cy="340" r="4" fill="#1f2937" />
                  <circle cx="525" cy="340" r="2" fill="#ffffff" />
                  
                  {/* Penalty areas with enhanced contrast */}
                  <rect x="50" y="195" width="165" height="290" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <rect x="50" y="195" width="165" height="290" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <rect x="835" y="195" width="165" height="290" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <rect x="835" y="195" width="165" height="290" stroke="#ffffff" strokeWidth="2" fill="none" />
                  
                  {/* Goal areas */}
                  <rect x="50" y="265" width="55" height="150" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <rect x="50" y="265" width="55" height="150" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <rect x="945" y="265" width="55" height="150" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <rect x="945" y="265" width="55" height="150" stroke="#ffffff" strokeWidth="2" fill="none" />
                  
                  {/* Penalty spots with enhanced visibility */}
                  <circle cx="165" cy="340" r="4" fill="#1f2937" />
                  <circle cx="165" cy="340" r="2" fill="#ffffff" />
                  <circle cx="885" cy="340" r="4" fill="#1f2937" />
                  <circle cx="885" cy="340" r="2" fill="#ffffff" />
                  
                  {/* Corner arcs with double stroke */}
                  <path d="M60 60 A 10 10 0 0 1 50 50" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <path d="M60 60 A 10 10 0 0 1 50 50" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <path d="M990 60 A 10 10 0 0 0 1000 50" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <path d="M990 60 A 10 10 0 0 0 1000 50" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <path d="M60 620 A 10 10 0 0 0 50 630" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <path d="M60 620 A 10 10 0 0 0 50 630" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <path d="M990 620 A 10 10 0 0 1 1000 630" stroke="#1f2937" strokeWidth="4" fill="none" />
                  <path d="M990 620 A 10 10 0 0 1 1000 630" stroke="#ffffff" strokeWidth="2" fill="none" />
                </svg>
              )}
              
              {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg p-3 sm:p-4 z-20 border-2 border-red-200 dark:border-red-800 rounded-2xl m-2">
                  <div className="bg-red-100 dark:bg-red-900/50 rounded-full p-4 mb-4">
                    <ImageOff className={`text-red-600 dark:text-red-400 ${isMobile ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'}`} />
                  </div>
                  <p className={`text-center text-gray-900 dark:text-white mb-3 font-bold ${
                    isMobile ? 'text-sm' : 'text-base sm:text-lg'
                  }`}>
                    Unable to load heatmap image
                  </p>
                  <div className={`flex gap-3 w-full ${isMobile ? 'flex-col max-w-56' : 'flex-col sm:flex-row max-w-xs'}`}>
                    <Button 
                      variant="outline" 
                      onClick={resetImageError}
                      className={`bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 font-medium shadow-lg flex-1 ${
                        isMobile ? 'text-sm h-12 min-h-[48px]' : 'text-sm h-10'
                      }`}
                      size="sm"
                    >
                      Retry Original
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={tryAlternativeUrl}
                      className={`bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-slate-700 hover:border-green-400 dark:hover:border-green-500 font-medium shadow-lg flex-1 ${
                        isMobile ? 'text-sm h-12 min-h-[48px]' : 'text-sm h-10'
                      }`}
                      size="sm"
                    >
                      Try Thumbnail
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                    <p className={`text-gray-800 dark:text-gray-200 text-center font-medium leading-relaxed ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      ⚠️ Image cannot be loaded due to CORS restrictions from Google Drive. 
                      Try uploading to a CORS-enabled image hosting service.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={imageUrl || player.heatmapUrl} 
                    alt={`${player.name} heatmap`}
                    className={`absolute inset-0 w-full h-full object-cover ${
                      isMobile ? 'touch-manipulation' : ''
                    }`}
                    crossOrigin="anonymous"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    referrerPolicy="no-referrer"
                    style={isMobile ? { touchAction: 'pan-x pan-y pinch-zoom' } : {}}
                  />
                  {/* Mobile zoom hint - enhanced visibility */}
                  {imageLoaded && isMobile && (
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl z-20 flex items-center gap-2 shadow-lg border border-white/30 dark:border-slate-700/30 backdrop-blur-sm">
                      <ZoomIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Pinch to zoom</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <Alert className="bg-orange-50/90 dark:bg-orange-900/30 border-2 border-orange-200 dark:border-orange-700 flex-1 flex items-center shadow-lg backdrop-blur-sm rounded-xl">
            <AlertDescription className={`text-gray-800 dark:text-gray-200 font-medium ${isMobile ? 'text-sm' : ''}`}>
              📊 Heatmap visualization not available for this player
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
