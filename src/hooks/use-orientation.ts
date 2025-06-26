
import { useState, useEffect } from 'react';

export type ScreenOrientation = 'portrait' | 'landscape';
export type ResponsiveBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'mobile' | 'tablet-portrait' | 'tablet-landscape' | 'desktop' | 'large';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<ScreenOrientation>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      if (screen.orientation) {
        setOrientation(screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape');
      } else {
        // Fallback for browsers without screen.orientation
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    updateOrientation();

    if (screen.orientation) {
      screen.orientation.addEventListener('change', updateOrientation);
      return () => screen.orientation.removeEventListener('change', updateOrientation);
    } else {
      window.addEventListener('resize', updateOrientation);
      return () => window.removeEventListener('resize', updateOrientation);
    }
  }, []);

  return orientation;
};

export const useResponsiveBreakpoint = (): ResponsiveBreakpoint => {
  const [breakpoint, setBreakpoint] = useState<ResponsiveBreakpoint>('md');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setBreakpoint('xs');
      } else if (width < 640) {
        setBreakpoint('sm');
      } else if (width < 768) {
        setBreakpoint('md');
      } else if (width < 1024) {
        setBreakpoint('lg');
      } else if (width < 1280) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Helper function to get semantic breakpoint names
export const getSemanticBreakpoint = (breakpoint: ResponsiveBreakpoint): ResponsiveBreakpoint => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return 'mobile';
    case 'md':
      return 'tablet-portrait';
    case 'lg':
      return 'tablet-landscape';
    case 'xl':
      return 'desktop';
    case '2xl':
      return 'large';
    default:
      return breakpoint;
  }
};

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasCamera: false,
    hasMicrophone: false,
    hasGeolocation: false,
    hasVibration: false,
    hasFullscreen: false,
    hasShare: false,
    isOnline: navigator.onLine
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      const newCapabilities = {
        hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasMicrophone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasGeolocation: !!navigator.geolocation,
        hasVibration: !!navigator.vibrate,
        hasFullscreen: !!(document.documentElement.requestFullscreen),
        hasShare: !!navigator.share,
        isOnline: navigator.onLine
      };

      setCapabilities(newCapabilities);
    };

    checkCapabilities();

    const handleOnlineChange = () => {
      setCapabilities(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);

    return () => {
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
    };
  }, []);

  return capabilities;
};
