
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface IOSCollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
}

export const IOSCollapsible = ({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
  icon
}: IOSCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | 'auto'>(defaultOpen ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        const scrollHeight = contentRef.current.scrollHeight;
        setHeight(scrollHeight);
        
        // Set to auto after animation completes
        const timer = setTimeout(() => {
          setHeight('auto');
        }, 300);
        
        return () => clearTimeout(timer);
      } else {
        setHeight(contentRef.current.scrollHeight);
        // Force reflow then set to 0
        setTimeout(() => setHeight(0), 10);
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    triggerHaptic('light');
  };

  return (
    <div className={cn(
      "bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl",
      "border border-[#E5E5EA]/50 dark:border-[#38383A]/50",
      "rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20",
      "transition-all duration-300 ease-out",
      "overflow-hidden",
      className
    )}>
      <button
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between p-4",
          "text-left transition-all duration-200 ease-out",
          "active:scale-[0.98] active:bg-[#F2F2F7]/50 dark:active:bg-[#2C2C2E]/50",
          "hover:bg-[#F2F2F7]/30 dark:hover:bg-[#2C2C2E]/30",
          titleClassName
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-[#007AFF] flex-shrink-0">
              {icon}
            </div>
          )}
          <h3 className="text-[#1D1D1F] dark:text-[#F2F2F7] font-semibold text-lg">
            {title}
          </h3>
        </div>
        
        <ChevronDown
          className={cn(
            "h-5 w-5 text-[#8E8E93] transition-transform duration-300 ease-out flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
      >
        <div className={cn(
          "px-4 pb-4",
          contentClassName
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
