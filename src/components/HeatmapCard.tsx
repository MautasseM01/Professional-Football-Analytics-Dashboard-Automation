
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
import { ImageOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getGoogleDriveThumbnailUrl } from "@/lib/image-utils";

interface HeatmapCardProps {
  player: Player;
}

export const HeatmapCard = ({ player }: HeatmapCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
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

  return (
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
  );
};
