
import { useState, useEffect } from 'react';

export type Orientation = 'portrait' | 'landscape';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      if (typeof window !== 'undefined') {
        const isLandscape = window.innerWidth > window.innerHeight;
        setOrientation(isLandscape ? 'landscape' : 'portrait');
      }
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'desktop' | 'large'>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        
        if (width >= 1200) {
          setBreakpoint('large');
        } else if (width >= 1024) {
          setBreakpoint('desktop');
        } else if (width >= 768) {
          setBreakpoint('tablet-landscape');
        } else if (width >= 640) {
          setBreakpoint('tablet-portrait');
        } else {
          setBreakpoint('mobile');
        }
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};
