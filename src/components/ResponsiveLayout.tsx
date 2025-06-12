
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
}

export const ResponsiveGrid = ({ 
  children, 
  className = "", 
  minCardWidth = "280px" 
}: ResponsiveGridProps) => {
  return (
    <div className={`
      responsive-grid
      grid gap-3 xs:gap-3 sm:gap-4 lg:gap-4 xl:gap-6
      transition-all duration-300 ease-in-out
      ${className}
    `}
    style={{
      gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`
    }}>
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
