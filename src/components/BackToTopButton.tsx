
import { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the main content scroll container
    const findScrollContainer = () => {
      // Look for the main scrollable content area with flex-1 overflow-auto
      const scrollableElements = document.querySelectorAll('.overflow-auto');
      
      for (const element of scrollableElements) {
        const styles = window.getComputedStyle(element);
        // Find element that has flex-1 and overflow-auto (main content area)
        if (element.classList.contains('flex-1') || 
            styles.flex === '1 1 0%' || 
            styles.flexGrow === '1') {
          return element as HTMLElement;
        }
      }
      
      // Fallback: look for main element with overflow-auto
      const mainElement = document.querySelector('main.overflow-auto');
      if (mainElement) {
        return mainElement as HTMLElement;
      }
      
      // Last fallback: look for any div with flex-1 overflow-auto
      const flexOverflowElement = document.querySelector('div.flex-1.overflow-auto');
      if (flexOverflowElement) {
        return flexOverflowElement as HTMLElement;
      }
      
      return null;
    };

    const toggleVisibility = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrolled = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const threshold = (scrollHeight - clientHeight) / 2; // Halfway through scrollable content
        setIsVisible(scrolled > threshold);
      } else {
        // Fallback to window scroll
        const scrolled = window.scrollY;
        const threshold = document.documentElement.scrollHeight / 2;
        setIsVisible(scrolled > threshold);
      }
    };

    // Initialize scroll container with a small delay to ensure DOM is ready
    const initializeContainer = () => {
      scrollContainerRef.current = findScrollContainer();
      
      const container = scrollContainerRef.current;
      
      if (container) {
        container.addEventListener('scroll', toggleVisibility);
        toggleVisibility(); // Initial check
        
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
    };

    // Use a small timeout to ensure the DOM is fully rendered
    const timeoutId = setTimeout(initializeContainer, 100);
    const cleanup = initializeContainer();

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
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
