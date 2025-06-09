
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'medium':
        case 'impact':
          navigator.vibrate(20);
          break;
        case 'heavy':
        case 'notification':
          navigator.vibrate([10, 50, 10]);
          break;
        default:
          navigator.vibrate(10);
      }
    }

    // Try to use the Haptic API if available (iOS Safari)
    if ('hapticFeedback' in navigator) {
      try {
        switch (type) {
          case 'light':
          case 'selection':
            (navigator as any).hapticFeedback.impact('light');
            break;
          case 'medium':
          case 'impact':
            (navigator as any).hapticFeedback.impact('medium');
            break;
          case 'heavy':
          case 'notification':
            (navigator as any).hapticFeedback.impact('heavy');
            break;
        }
      } catch (error) {
        console.log('Haptic feedback not supported');
      }
    }
  }, []);

  return { triggerHaptic };
};
