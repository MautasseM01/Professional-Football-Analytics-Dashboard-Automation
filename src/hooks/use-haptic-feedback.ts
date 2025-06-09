
import { useCallback } from 'react';

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // For web, we simulate haptic feedback with subtle visual feedback
    // In a real iOS app, this would trigger actual haptic feedback
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // Simple vibration patterns for different haptic types
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        selection: [5],
        impact: [15],
        notification: [10, 50, 10]
      };
      
      try {
        navigator.vibrate(patterns[type]);
      } catch (error) {
        // Fallback: do nothing if vibration is not supported
        console.debug('Haptic feedback not supported');
      }
    }
    
    // Visual feedback simulation
    const body = document.body;
    body.style.setProperty('--haptic-feedback', '1');
    setTimeout(() => {
      body.style.setProperty('--haptic-feedback', '0');
    }, 50);
  }, []);

  return { triggerHaptic };
};
