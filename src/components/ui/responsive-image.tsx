
import React, { useState } from 'react';
import { useImageLazyLoading } from '@/hooks/use-lazy-loading';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  sizes = '100vw',
  priority = false,
  onLoad,
  onError
}) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, imageSrc, isLoading, error } = useImageLazyLoading(src);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  // Generate responsive image URLs for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    // For Google Drive images, try to generate different sizes
    if (originalSrc.includes('drive.google.com')) {
      const fileId = originalSrc.match(/[?&]id=([^&]+)/)?.[1];
      if (fileId) {
        return [
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w400 400w`,
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w800 800w`,
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200 1200w`
        ].join(', ');
      }
    }
    return undefined;
  };

  const srcSet = generateSrcSet(src);

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-muted ${className}`}
      style={{ aspectRatio }}
    >
      {isLoading && !imageSrc && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageOff className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} mb-2`} />
            <span className={`text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Failed to load image
            </span>
          </div>
        </div>
      )}

      {imageSrc && !error && (
        <>
          <img
            src={imageSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
        </>
      )}
    </div>
  );
};
