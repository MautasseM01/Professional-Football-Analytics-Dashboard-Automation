
import { useState, useEffect } from 'react';

export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'mobile' | 'tablet-portrait' | 'tablet-landscape';

export const useResponsiveBreakpoint = (): BreakpointType => {
  const [breakpoint, setBreakpoint] = useState<BreakpointType>('md');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 480) {
        setBreakpoint('mobile');
      } else if (width < 640) {
        setBreakpoint('sm');
      } else if (width < 768) {
        if (height > width) {
          setBreakpoint('tablet-portrait');
        } else {
          setBreakpoint('md');
        }
      } else if (width < 1024) {
        if (height > width) {
          setBreakpoint('tablet-portrait');
        } else {
          setBreakpoint('tablet-landscape');
        }
      } else if (width < 1280) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    window.addEventListener('orientationchange', updateBreakpoint);
    
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('orientationchange', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};
