
import { useState, useCallback, useRef } from 'react';
import { useHapticFeedback } from './use-haptic-feedback';

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
}

interface UseSwipeGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false
}: UseSwipeGesturesProps) => {
  const [startTouch, setStartTouch] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeDistance = useRef({ x: 0, y: 0 });
  const { triggerHaptic } = useHapticFeedback();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartTouch({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(false);
    swipeDistance.current = { x: 0, y: 0 };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startTouch) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    
    swipeDistance.current = { x: deltaX, y: deltaY };

    // Check if this is a swipe gesture
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
    
    if ((isHorizontalSwipe && Math.abs(deltaX) > threshold) || 
        (isVerticalSwipe && Math.abs(deltaY) > threshold)) {
      setIsSwiping(true);
      
      if (preventScroll) {
        e.preventDefault();
      }
    }
  }, [startTouch, threshold, preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!startTouch || !isSwiping) {
      setStartTouch(null);
      setIsSwiping(false);
      return;
    }

    const { x: deltaX, y: deltaY } = swipeDistance.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > threshold && onSwipeRight) {
        triggerHaptic('light');
        onSwipeRight();
      } else if (deltaX < -threshold && onSwipeLeft) {
        triggerHaptic('light');
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > threshold && onSwipeDown) {
        triggerHaptic('light');
        onSwipeDown();
      } else if (deltaY < -threshold && onSwipeUp) {
        triggerHaptic('light');
        onSwipeUp();
      }
    }

    setStartTouch(null);
    setIsSwiping(false);
  }, [startTouch, isSwiping, threshold, triggerHaptic, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    swipeProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isSwiping,
    swipeDistance: swipeDistance.current
  };
};
