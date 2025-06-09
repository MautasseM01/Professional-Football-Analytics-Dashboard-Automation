
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeNavigationProps {
  children: ReactNode[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  className?: string;
}

export const SwipeNavigation = ({ 
  children, 
  currentIndex, 
  onSwipe, 
  className = "" 
}: SwipeNavigationProps) => {
  const isMobile = useIsMobile();
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile || !isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentIndex > 0) {
        onSwipe('right'); // Swipe right to go back
      } else if (diffX < 0 && currentIndex < children.length - 1) {
        onSwipe('left'); // Swipe left to go forward
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (isMobile || !isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentIndex > 0) {
        onSwipe('right');
      } else if (diffX < 0 && currentIndex < children.length - 1) {
        onSwipe('left');
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const translateX = isDragging ? currentX - startX : 0;

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
          width: `${children.length * 100}%`
        }}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0"
            style={{ width: `${100 / children.length}%` }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Swipe indicators */}
      {children.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {children.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
