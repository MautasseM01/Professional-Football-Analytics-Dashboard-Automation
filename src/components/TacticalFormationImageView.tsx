import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TouchFeedbackButton } from '@/components/TouchFeedbackButton';
import { AlertCircle, RefreshCw, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getGoogleDriveDirectUrl, getGoogleDriveThumbnailUrl } from '@/lib/image-utils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TacticalImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'formation' | 'heatmap' | 'analysis';
  timestamp?: string;
}

interface TacticalFormationImageViewProps {
  matchId: number;
  onImageError?: () => void;
  onImageRetry?: () => void;
  className?: string;
}

const SUPABASE_URL = "https://qtsrymkdgpzaiobvsobb.supabase.co";

export const TacticalFormationImageView = ({
  matchId,
  onImageError,
  onImageRetry,
  className
}: TacticalFormationImageViewProps) => {
  const [images, setImages] = useState<TacticalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const isMobile = useIsMobile();

  // Mock tactical images with fallback data
  const mockTacticalImages: TacticalImage[] = [
    {
      id: 'formation-1',
      title: 'Starting Formation (4-4-2)',
      description: 'Initial team formation and positioning',
      imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
      type: 'formation',
      timestamp: '0:00'
    },
    {
      id: 'formation-2',
      title: 'Defensive Shape',
      description: 'Team defensive positioning analysis',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
      type: 'analysis',
      timestamp: '15:30'
    },
    {
      id: 'heatmap-1',
      title: 'Team Movement Heatmap',
      description: 'Overall team movement and positioning density',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      type: 'heatmap',
      timestamp: '45:00'
    },
    {
      id: 'formation-3',
      title: 'Second Half Formation (4-3-3)',
      description: 'Tactical adjustment for second half',
      imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=600&fit=crop',
      type: 'formation',
      timestamp: '46:00'
    }
  ];

  useEffect(() => {
    loadTacticalImages();
  }, [matchId]);

  const loadTacticalImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load images from Supabase Storage first
      const { data: storageImages, error: storageError } = await supabase.storage
        .from('tactical-analysis')
        .list(`match-${matchId}`, {
          limit: 10,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (storageError) {
        console.warn('Storage images not found, using mock data:', storageError);
        // Use mock data as fallback
        setImages(mockTacticalImages);
        setLoading(false);
        return;
      }

      if (storageImages && storageImages.length > 0) {
        const formattedImages: TacticalImage[] = storageImages.map((file, index) => ({
          id: file.name,
          title: `Tactical Analysis ${index + 1}`,
          description: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
          imageUrl: `${SUPABASE_URL}/storage/v1/object/public/tactical-analysis/match-${matchId}/${file.name}`,
          type: file.name.includes('formation') ? 'formation' : 
                file.name.includes('heatmap') ? 'heatmap' : 'analysis',
          timestamp: `${Math.floor(index * 15)}:00`
        }));
        setImages(formattedImages);
      } else {
        // No images found, use mock data
        setImages(mockTacticalImages);
      }
    } catch (err) {
      console.error('Error loading tactical images:', err);
      setError('Failed to load tactical analysis images');
      setImages(mockTacticalImages); // Fallback to mock data
      onImageError?.();
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId));
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    onImageError?.();
  };

  const handleImageLoadStart = (imageId: string) => {
    setImageLoading(prev => new Set(prev).add(imageId));
  };

  const handleRetry = () => {
    setImageErrors(new Set());
    setError(null);
    onImageRetry?.();
    loadTacticalImages();
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'formation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'heatmap': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'analysis': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-club-gold mx-auto"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading tactical analysis images...</p>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">Failed to Load Images</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
          <TouchFeedbackButton onClick={handleRetry} variant="outline" size="sm" hapticType="medium">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </TouchFeedbackButton>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Mobile-optimized Zoom Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TouchFeedbackButton 
            onClick={handleZoomOut} 
            variant="outline" 
            size={isMobile ? "default" : "sm"} 
            disabled={zoom <= 0.5}
            className="min-h-[44px] min-w-[44px]"
            hapticType="light"
          >
            <ZoomOut className="h-4 w-4" />
          </TouchFeedbackButton>
          <span className="text-sm font-medium min-w-[60px] text-center bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border">
            {Math.round(zoom * 100)}%
          </span>
          <TouchFeedbackButton 
            onClick={handleZoomIn} 
            variant="outline" 
            size={isMobile ? "default" : "sm"} 
            disabled={zoom >= 3}
            className="min-h-[44px] min-w-[44px]"
            hapticType="light"
          >
            <ZoomIn className="h-4 w-4" />
          </TouchFeedbackButton>
          <TouchFeedbackButton 
            onClick={handleZoomReset} 
            variant="outline" 
            size={isMobile ? "default" : "sm"}
            className="min-h-[44px] px-4"
            hapticType="medium"
          >
            <RotateCcw className="h-4 w-4" />
          </TouchFeedbackButton>
        </div>
        <Badge variant="secondary" className="text-xs whitespace-nowrap">
          {images.length} image{images.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Mobile-responsive Image Grid */}
      <div 
        className={cn(
          "grid gap-3 sm:gap-4 transition-transform duration-200",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
          >
            <div className={cn(
              "relative bg-gray-100 dark:bg-gray-800",
              isMobile ? "aspect-[4/3]" : "aspect-[4/3]"
            )}>
              {imageLoading.has(image.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-club-gold"></div>
                </div>
              )}
              
              {imageErrors.has(image.id) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="text-center space-y-2 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Image failed to load</p>
                    <TouchFeedbackButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageErrors(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(image.id);
                          return newSet;
                        });
                      }}
                      variant="outline" 
                      size="sm"
                      className="text-xs min-h-[44px]"
                      hapticType="light"
                    >
                      Retry
                    </TouchFeedbackButton>
                  </div>
                </div>
              ) : (
                <img
                  src={getGoogleDriveDirectUrl(image.imageUrl)}
                  alt={`${image.title} - ${image.description}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                  onLoadStart={() => handleImageLoadStart(image.id)}
                  loading="lazy"
                />
              )}
              
              {/* Mobile-optimized Overlay Controls */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <TouchFeedbackButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.imageUrl, image.title);
                  }}
                  variant="secondary"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] p-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                  hapticType="medium"
                >
                  <Download className="h-4 w-4" />
                </TouchFeedbackButton>
              </div>

              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <Badge className={cn("text-xs capitalize", getTypeColor(image.type))}>
                  {image.type}
                </Badge>
              </div>

              {/* Timestamp */}
              {image.timestamp && (
                <div className="absolute bottom-3 right-3">
                  <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    {image.timestamp}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-3 sm:p-4">
              <h3 className={cn(
                "font-medium mb-1 text-gray-900 dark:text-white",
                isMobile ? "text-base" : "text-sm"
              )}>
                {image.title}
              </h3>
              <p className={cn(
                "text-gray-600 dark:text-gray-400 line-clamp-2",
                isMobile ? "text-sm" : "text-xs"
              )}>
                {image.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile-optimized Expanded View */}
      {selectedImage && (
        <Card className="mt-6 bg-gray-50 dark:bg-gray-900">
          <CardContent className="p-4 sm:p-6">
            {(() => {
              const image = images.find(img => img.id === selectedImage);
              if (!image) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className={cn(
                        "font-semibold text-gray-900 dark:text-white",
                        isMobile ? "text-lg" : "text-lg"
                      )}>
                        {image.title}
                      </h3>
                      <p className={cn(
                        "text-gray-600 dark:text-gray-400 mt-1",
                        isMobile ? "text-sm" : "text-sm"
                      )}>
                        {image.description}
                      </p>
                    </div>
                    <TouchFeedbackButton
                      onClick={() => setSelectedImage(null)}
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] flex-shrink-0"
                      hapticType="light"
                    >
                      Close
                    </TouchFeedbackButton>
                  </div>
                  
                  <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={getGoogleDriveDirectUrl(image.imageUrl)}
                      alt={`${image.title} - ${image.description}`}
                      className={cn(
                        "w-full object-contain",
                        isMobile ? "max-h-[60vh]" : "max-h-[70vh]"
                      )}
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Mobile-optimized Error Summary */}
      {imageErrors.size > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className={cn(
            "text-amber-800 dark:text-amber-200 flex-1",
            isMobile ? "text-sm" : "text-sm"
          )}>
            {imageErrors.size} image{imageErrors.size !== 1 ? 's' : ''} failed to load. Using fallback display.
          </span>
          <TouchFeedbackButton 
            onClick={handleRetry} 
            variant="outline" 
            size="sm" 
            className="min-h-[44px] flex-shrink-0"
            hapticType="medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry All
          </TouchFeedbackButton>
        </div>
      )}
    </div>
  );
};
