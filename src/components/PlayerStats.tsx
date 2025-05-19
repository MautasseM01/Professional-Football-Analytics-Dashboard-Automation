
import { Player } from "@/types";
import { StatCard } from "./StatCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  PieChart, 
  Download,
  Activity,
  Calendar,
  ImageOff
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getGoogleDriveThumbnailUrl } from "@/lib/image-utils";

interface PlayerStatsProps {
  player: Player | null;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  console.log("PlayerStats component received player:", player);
  console.log("Original Heatmap URL:", player?.heatmapUrl);
  
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Reset state when player changes to ensure image corresponds to current player
  useEffect(() => {
    if (player) {
      console.log(`Player changed to: ${player.name}, Setting image URL to: ${player.heatmapUrl}`);
      // Reset the image error state when player changes
      setImageError(false);
      // Set the image URL directly from the player data
      setImageUrl(player.heatmapUrl);
    } else {
      // Clear the image URL when no player is selected
      setImageUrl(null);
    }
  }, [player?.id]); // Using player.id ensures this runs only when the selected player changes
  
  if (!player) {
    return <div className="text-center py-8">No player selected</div>;
  }

  const handleReportDownload = () => {
    if (player.reportUrl) {
      window.open(player.reportUrl, '_blank');
    }
  };

  const passCompletionRate = player.passes_attempted > 0
    ? ((player.passes_completed / player.passes_attempted) * 100).toFixed(1)
    : "0";

  const shotsAccuracy = player.shots_total > 0
    ? ((player.shots_on_target / player.shots_total) * 100).toFixed(1)
    : "0";

  const tackleSuccessRate = player.tackles_attempted > 0
    ? ((player.tackles_won / player.tackles_attempted) * 100).toFixed(1)
    : "0";

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
    if (player && player.heatmapUrl) {
      // Try using an image proxy service or thumbnail
      const thumbnailUrl = getGoogleDriveThumbnailUrl(player.heatmapUrl);
      if (thumbnailUrl) {
        console.log(`Trying thumbnail URL for ${player.name}:`, thumbnailUrl);
        setImageUrl(thumbnailUrl);
        setImageError(false);
      }
    }
  };

  const resetImageError = () => {
    if (player && player.heatmapUrl) {
      console.log(`Resetting to original URL for ${player.name}:`, player.heatmapUrl);
      setImageUrl(player.heatmapUrl);
      setImageError(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Matches Played" 
          value={player.matches} 
          icon={<Calendar size={24} />} 
        />
        <StatCard 
          title="Distance Covered" 
          value={player.distance} 
          subValue="kilometers" 
          icon={<Activity size={24} />} 
        />
        <StatCard 
          title="Pass Completion" 
          value={`${passCompletionRate}%`} 
          subValue={`${player.passes_completed}/${player.passes_attempted} passes`} 
          icon={<BarChart size={24} />} 
        />
        <StatCard 
          title="Shot Accuracy" 
          value={`${shotsAccuracy}%`} 
          subValue={`${player.shots_on_target}/${player.shots_total} shots`} 
          icon={<PieChart size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-club-gold/20 bg-club-dark-gray md:col-span-2">
          <CardHeader>
            <CardTitle className="text-club-gold">Performance Heatmap</CardTitle>
            <CardDescription>Player's match positioning and movement</CardDescription>
          </CardHeader>
          <CardContent>
            {player.heatmapUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center h-full bg-club-black/50 p-4">
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
                  <img 
                    src={imageUrl || player.heatmapUrl} 
                    alt={`${player.name} heatmap`}
                    className="object-cover w-full h-full"
                    crossOrigin="anonymous"
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute bottom-2 right-2 bg-club-black/70 text-xs px-2 py-1 rounded">
                  {player.name}'s Heatmap
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
        
        <Card className="border-club-gold/20 bg-club-dark-gray">
          <CardHeader>
            <CardTitle className="text-club-gold">Tackle Success</CardTitle>
            <CardDescription>Defensive performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-club-light-gray/70">Success Rate</span>
                <span className="text-club-gold font-medium">{tackleSuccessRate}%</span>
              </div>
              <div className="w-full bg-club-black rounded-full h-2">
                <div 
                  className="bg-club-gold h-2 rounded-full" 
                  style={{ width: `${tackleSuccessRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-club-light-gray/60">
                <span>Won: {player.tackles_won}</span>
                <span>Attempted: {player.tackles_attempted}</span>
              </div>
            </div>

            {player.reportUrl && (
              <Button 
                onClick={handleReportDownload}
                variant="outline"
                className="w-full border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
              >
                <Download size={16} className="mr-2" />
                Download Full Report
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
