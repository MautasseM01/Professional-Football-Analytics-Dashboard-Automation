
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className = "" }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`responsive-container transition-all duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  minCardWidth?: string;
  forceTwoColumns?: boolean; // New prop for 2x2 layout on mobile
}

export const ResponsiveGrid = ({ 
  children, 
  className = "", 
  minCardWidth = "280px",
  forceTwoColumns = false
}: ResponsiveGridProps) => {
  // Override grid classes for 2x2 layout on mobile when forceTwoColumns is true
  const gridClasses = forceTwoColumns 
    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-3 sm:gap-4 lg:gap-4 xl:gap-6"
    : `grid gap-3 xs:gap-3 sm:gap-4 lg:gap-4 xl:gap-6 ${className}`;

  const style = forceTwoColumns 
    ? {} 
    : { gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))` };

  return (
    <div 
      className={`
        responsive-grid
        transition-all duration-300 ease-in-out
        ${gridClasses}
      `}
      style={style}
    >
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
  const getDirectionClasses = () => {
    switch (direction) {
      case 'horizontal':
        return 'flex-row';
      case 'vertical':
        return 'flex-col';
      case 'auto':
      default:
        return 'flex-col xs:flex-col sm:flex-row lg:flex-row';
    }
  };

  return (
    <div className={`
      responsive-stack
      flex gap-3 xs:gap-4 sm:gap-4 md:gap-6
      ${getDirectionClasses()}
      transition-all duration-300 ease-in-out
      ${className}
    `}>
      {children}
    </div>
  );
};
