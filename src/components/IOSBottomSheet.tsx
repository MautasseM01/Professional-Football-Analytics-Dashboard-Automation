
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface IOSBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  initialHeight?: "collapsed" | "half" | "full";
  enableDrag?: boolean;
  showOverlay?: boolean;
}

export const IOSBottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  initialHeight = "half",
  enableDrag = true,
  showOverlay = true
}: IOSBottomSheetProps) => {
  const [height, setHeight] = useState<"collapsed" | "half" | "full">(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const heightClasses = {
    collapsed: "h-[20vh]",
    half: "h-[50vh]",
    full: "h-[90vh]"
  };

  const heightTransforms = {
    collapsed: "translate-y-[80vh]",
    half: "translate-y-[50vh]",
    full: "translate-y-[10vh]"
  };

  // Handle drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !enableDrag) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !enableDrag) return;
    
    const deltaY = currentY - startY;
    const threshold = 50;

    if (deltaY > threshold) {
      // Dragging down
      if (height === "full") {
        setHeight("half");
        triggerHaptic("light");
      } else if (height === "half") {
        setHeight("collapsed");
        triggerHaptic("light");
      } else {
        onClose();
        triggerHaptic("medium");
      }
    } else if (deltaY < -threshold) {
      // Dragging up
      if (height === "collapsed") {
        setHeight("half");
        triggerHaptic("light");
      } else if (height === "half") {
        setHeight("full");
        triggerHaptic("light");
      }
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Auto-adjust for keyboard
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        if (sheetRef.current && keyboardHeight > 100) {
          sheetRef.current.style.paddingBottom = `${keyboardHeight}px`;
        } else if (sheetRef.current) {
          sheetRef.current.style.paddingBottom = "0px";
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl",
          "transition-all duration-500 ease-out",
          heightClasses[height],
          !isDragging && "transform-gpu"
        )}
        style={{
          transform: isDragging 
            ? `translateY(${Math.max(0, currentY - startY)}px)` 
            : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto overscroll-contain p-6">
          {children}
        </div>

        {/* Safe area */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </>
  );
};
