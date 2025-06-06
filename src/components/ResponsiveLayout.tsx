
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({ children, className = "" }: ResponsiveLayoutProps) => {
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
  mobileCols?: number;
}

export const ResponsiveGrid = ({ 
  children, 
  className = "", 
  minCardWidth = "280px",
  mobileCols = 1
}: ResponsiveGridProps) => {
  const mobileColsClass = mobileCols === 1 ? "grid-cols-1" : `grid-cols-${mobileCols}`;
  
  return (
    <div className={`
      responsive-grid
      grid ${mobileColsClass} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      gap-3 sm:gap-4 lg:gap-6
      transition-all duration-300 ease-in-out
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
  const getDirectionClasses = () => {
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
      flex gap-3 sm:gap-4 lg:gap-6
      ${getDirectionClasses()}
      transition-all duration-300 ease-in-out
      ${className}
    `}>
      {children}
    </div>
  );
};
