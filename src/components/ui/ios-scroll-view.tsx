
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface IOSScrollViewProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicator?: boolean;
  bounceVertical?: boolean;
  bounceHorizontal?: boolean;
}

export const IOSScrollView = ({
  children,
  className,
  showScrollIndicator = true,
  bounceVertical = true,
  bounceHorizontal = false
}: IOSScrollViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let isScrolling = false;
    let scrollTop = 0;
    let scrollLeft = 0;

    const handleTouchStart = () => {
      isScrolling = true;
      scrollTop = scrollElement.scrollTop;
      scrollLeft = scrollElement.scrollLeft;
    };

    const handleTouchEnd = () => {
      isScrolling = false;
      
      // Bounce back effect for overscroll
      if (bounceVertical) {
        if (scrollElement.scrollTop < 0) {
          scrollElement.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else if (scrollElement.scrollTop > scrollElement.scrollHeight - scrollElement.clientHeight) {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight - scrollElement.clientHeight,
            behavior: 'smooth'
          });
        }
      }

      if (bounceHorizontal) {
        if (scrollElement.scrollLeft < 0) {
          scrollElement.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else if (scrollElement.scrollLeft > scrollElement.scrollWidth - scrollElement.clientWidth) {
          scrollElement.scrollTo({
            left: scrollElement.scrollWidth - scrollElement.clientWidth,
            behavior: 'smooth'
          });
        }
      }
    };

    scrollElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      scrollElement.removeEventListener('touchstart', handleTouchStart);
      scrollElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [bounceVertical, bounceHorizontal]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "overflow-auto scroll-smooth",
        // iOS-style scrolling behavior
        "-webkit-overflow-scrolling: touch",
        "overscroll-behavior-y: contain",
        // Hide scrollbar on mobile, show on desktop if requested
        showScrollIndicator 
          ? "scrollbar-thin scrollbar-thumb-[#8E8E93]/30 scrollbar-track-transparent" 
          : "scrollbar-hide md:scrollbar-thin md:scrollbar-thumb-[#8E8E93]/30 md:scrollbar-track-transparent",
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: bounceVertical || bounceHorizontal ? 'contain' : 'auto'
      }}
    >
      {children}
    </div>
  );
};
