
import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the main content scroll container
    const findScrollContainer = () => {
      // Look for the main content area that has overflow-auto
      const mainElement = document.querySelector('main');
      if (mainElement) {
        // Check if main itself has scroll
        const mainStyles = window.getComputedStyle(mainElement);
        if (mainStyles.overflow === 'auto' || mainStyles.overflowY === 'auto') {
          return mainElement;
        }
        
        // Look for a child with overflow-auto
        const scrollableChild = mainElement.querySelector('[class*="overflow-auto"]');
        if (scrollableChild) {
          return scrollableChild as HTMLElement;
        }
      }
      
      // Fallback to window
      return null;
    };

    const toggleVisibility = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // For element scroll, check scrollTop
        const scrolled = container.scrollTop;
        const threshold = container.scrollHeight / 2; // Halfway down
        setIsVisible(scrolled > threshold);
      } else {
        // Fallback to window scroll
        const scrolled = window.scrollY;
        const threshold = document.documentElement.scrollHeight / 2;
        setIsVisible(scrolled > threshold);
      }
    };

    // Initialize scroll container
    scrollContainerRef.current = findScrollContainer();
    
    const container = scrollContainerRef.current;
    
    if (container) {
      // Add scroll listener to the container element
      container.addEventListener('scroll', toggleVisibility);
      
      // Initial check
      toggleVisibility();
      
      return () => {
        container.removeEventListener('scroll', toggleVisibility);
      };
    } else {
      // Fallback to window scroll
      window.addEventListener('scroll', toggleVisibility);
      toggleVisibility();
      
      return () => {
        window.removeEventListener('scroll', toggleVisibility);
      };
    }
  }, []);

  const scrollToTop = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <Button
        onClick={scrollToTop}
        onKeyDown={handleKeyDown}
        className="
          w-12 h-12 rounded-full bg-club-gold hover:bg-club-gold/90 
          text-club-black hover:text-club-black
          shadow-lg hover:shadow-xl
          transition-all duration-200 ease-in-out
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-club-gold/50 focus:ring-offset-2 focus:ring-offset-club-black
          border-0
        "
        size="icon"
        aria-label="Back to top"
        title="Back to top"
      >
        <ChevronUp size={20} className="text-club-black" />
      </Button>
    </div>
  );
};
