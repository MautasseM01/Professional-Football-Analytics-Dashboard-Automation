
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface LongPressMenuItem {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  destructive?: boolean;
}

interface LongPressMenuProps {
  children: React.ReactNode;
  items: LongPressMenuItem[];
  className?: string;
  disabled?: boolean;
}

export const LongPressMenu = ({ 
  children, 
  items, 
  className,
  disabled = false 
}: LongPressMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const { triggerHaptic } = useHapticFeedback();

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;
    
    setIsPressed(true);
    triggerHaptic('selection');
    
    longPressTimer.current = setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setIsMenuOpen(true);
      setIsPressed(false);
      triggerHaptic('heavy');
    }, 500);
  }, [disabled, triggerHaptic]);

  const handleEnd = useCallback(() => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMenuItemClick = useCallback((action: () => void) => {
    triggerHaptic('impact');
    action();
    setIsMenuOpen(false);
  }, [triggerHaptic]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = () => closeMenu();
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "transition-all duration-150",
          isPressed && "scale-95 opacity-80",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {children}
      </div>

      {/* Context Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu */}
          <div
            className="absolute bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#F2F2F7]/20 overflow-hidden animate-scale-in"
            style={{
              left: Math.min(menuPosition.x, window.innerWidth - 200),
              top: Math.min(menuPosition.y, window.innerHeight - (items.length * 50 + 20)),
              minWidth: '180px'
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[#007AFF]/10 transition-colors duration-200 min-h-[44px]",
                  item.destructive && "text-red-500 hover:bg-red-500/10",
                  index < items.length - 1 && "border-b border-[#F2F2F7]/20"
                )}
                onClick={() => handleMenuItemClick(item.action)}
              >
                {item.icon && (
                  <div className="w-5 h-5 flex-shrink-0">
                    {item.icon}
                  </div>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
