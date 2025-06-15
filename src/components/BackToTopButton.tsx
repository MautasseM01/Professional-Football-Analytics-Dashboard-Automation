
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down past 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  // Hide button on login page
  if (location.pathname === '/login') {
    return null;
  }

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
