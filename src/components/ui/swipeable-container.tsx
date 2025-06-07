
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface SwipeableContainerProps {
  children: React.ReactNode[];
  className?: string;
  onSwipe?: (direction: 'left' | 'right', currentIndex: number) => void;
  initialIndex?: number;
  showIndicators?: boolean;
}

export const SwipeableContainer = ({ 
  children, 
  className, 
  onSwipe,
  initialIndex = 0,
  showIndicators = true
}: SwipeableContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    triggerHaptic('selection');
  }, [triggerHaptic]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
  }, [isDragging, startX]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(translateX) > threshold) {
      const direction = translateX > 0 ? 'right' : 'left';
      let newIndex = currentIndex;
      
      if (direction === 'left' && currentIndex < children.length - 1) {
        newIndex = currentIndex + 1;
      } else if (direction === 'right' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onSwipe?.(direction, newIndex);
        triggerHaptic('impact');
      }
    }
    
    setTranslateX(0);
  }, [isDragging, translateX, currentIndex, children.length, onSwipe, triggerHaptic]);

  // Mouse events for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    setTranslateX(diffX);
  }, [isDragging, startX]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(translateX) > threshold) {
      const direction = translateX > 0 ? 'right' : 'left';
      let newIndex = currentIndex;
      
      if (direction === 'left' && currentIndex < children.length - 1) {
        newIndex = currentIndex + 1;
      } else if (direction === 'right' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onSwipe?.(direction, newIndex);
      }
    }
    
    setTranslateX(0);
  }, [isDragging, translateX, currentIndex, children.length, onSwipe]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setTranslateX(0);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div className={cn("relative overflow-hidden touch-pan-y", className)}>
      <div
        ref={containerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${-currentIndex * 100 + (isDragging ? (translateX / (containerRef.current?.clientWidth || 1)) * 100 : 0)}%)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      
      {showIndicators && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-[#007AFF] scale-125" 
                  : "bg-[#8E8E93]/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
