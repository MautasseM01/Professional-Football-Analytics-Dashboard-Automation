
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface IOSPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const IOSPageTransition = ({ children, className }: IOSPageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);
    
    // Determine animation direction based on route depth
    const pathDepth = location.pathname.split('/').length;
    const prevDepth = sessionStorage.getItem('prevPathDepth');
    
    if (prevDepth) {
      setDirection(pathDepth > parseInt(prevDepth) ? 'forward' : 'backward');
    }
    
    sessionStorage.setItem('prevPathDepth', pathDepth.toString());
    
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={cn(
      "w-full h-full transition-all duration-300 ease-out",
      "transform-gpu", // Hardware acceleration
      isVisible 
        ? "translate-x-0 opacity-100 scale-100" 
        : direction === 'forward' 
          ? "translate-x-full opacity-0 scale-95"
          : "-translate-x-full opacity-0 scale-95",
      className
    )}>
      {children}
    </div>
  );
};
