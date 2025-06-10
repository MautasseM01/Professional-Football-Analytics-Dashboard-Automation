
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if the device supports haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      let pattern: number[];
      
      switch (type) {
        case 'light':
          pattern = [10];
          break;
        case 'medium':
          pattern = [20];
          break;
        case 'heavy':
          pattern = [30];
          break;
        default:
          pattern = [10];
      }
      
      navigator.vibrate(pattern);
    }
    
    // For iOS devices with haptic feedback support
    if (typeof window !== 'undefined' && 'Taptic' in window) {
      try {
        // @ts-ignore - Taptic is not in TypeScript definitions
        window.Taptic.impact({ style: type });
      } catch (error) {
        // Silently fail if Taptic is not available
      }
    }
  }, []);

  const isHapticSupported = useCallback(() => {
    return typeof window !== 'undefined' && 
           ('vibrate' in navigator || 'Taptic' in window);
  }, []);

  return {
    triggerHaptic,
    isHapticSupported
  };
};
