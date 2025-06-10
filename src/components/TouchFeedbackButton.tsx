
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface TouchFeedbackButtonProps extends ButtonProps {
  children: React.ReactNode;
  hapticType?: 'light' | 'medium' | 'heavy';
}

export const TouchFeedbackButton = ({ 
  children, 
  className,
  hapticType = 'light',
  onClick,
  ...props 
}: TouchFeedbackButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic(hapticType);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      className={cn(
        "transition-all duration-150 ease-out",
        "active:scale-95 touch-manipulation",
        isPressed && "scale-95",
        "min-h-[44px] min-w-[44px]", // iOS minimum touch target
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
