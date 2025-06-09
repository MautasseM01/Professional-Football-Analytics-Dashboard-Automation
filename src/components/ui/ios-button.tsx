
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  children: React.ReactNode;
}

export const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    hapticType = 'light',
    children, 
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const { triggerHaptic } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      triggerHaptic(hapticType);
      onClick?.(e);
    };

    const handleTouchStart = () => {
      if (!disabled) {
        setIsPressed(true);
        triggerHaptic('selection');
      }
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
    };

    const variants = {
      primary: "bg-[#007AFF] hover:bg-[#0056CC] text-white shadow-lg",
      secondary: "bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] dark:text-white",
      destructive: "bg-[#FF3B30] hover:bg-[#D70015] text-white shadow-lg",
      ghost: "bg-transparent hover:bg-[#F2F2F7]/50 dark:hover:bg-[#2C2C2E]/50"
    };

    const sizes = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-3 text-base min-h-[44px]",
      lg: "px-6 py-4 text-lg min-h-[52px]"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 touch-manipulation",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          variants[variant],
          sizes[size],
          isPressed && "scale-95 brightness-110",
          className
        )}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IOSButton.displayName = "IOSButton";
