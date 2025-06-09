
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className = "" }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`responsive-container transition-all duration-300 ease-in-out ${isMobile ? 'px-0' : 'px-3 sm:px-4 lg:px-6'} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  minCardWidth?: string;
  mobileCols?: number;
}

export const ResponsiveGrid = ({ 
  children, 
  className = "", 
  minCardWidth = "280px",
  mobileCols = 1
}: ResponsiveGridProps) => {
  const isMobile = useIsMobile();
  
  // Use iOS spacing patterns: 16px, 24px gaps
  const mobileColsClass = isMobile ? "grid-cols-1" : 
    mobileCols === 1 ? "grid-cols-1" : `grid-cols-${mobileCols}`;
  
  return (
    <div className={`
      responsive-grid
      grid ${mobileColsClass} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      ${isMobile ? 'gap-4' : 'gap-3 sm:gap-4 lg:gap-6 xl:gap-8'}
      transition-all duration-300 ease-in-out
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical' | 'auto';
  className?: string;
}

export const ResponsiveStack = ({ 
  children, 
  direction = 'auto', 
  className = "" 
}: ResponsiveStackProps) => {
  const isMobile = useIsMobile();
  
  const getDirectionClasses = () => {
    if (isMobile) return 'flex-col'; // Always stack vertically on mobile
    
    switch (direction) {
      case 'horizontal':
        return 'flex-row';
      case 'vertical':
        return 'flex-col';
      case 'auto':
      default:
        return 'flex-col sm:flex-row';
    }
  };

  return (
    <div className={`
      responsive-stack
      flex ${isMobile ? 'gap-4' : 'gap-3 sm:gap-4 lg:gap-6 xl:gap-8'}
      ${getDirectionClasses()}
      transition-all duration-300 ease-in-out
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};
