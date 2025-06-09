
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';
  touchFeedback?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, hapticType = 'light', touchFeedback = true, onClick, children, ...props }, ref) => {
    const { triggerHaptic } = useHapticFeedback();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (touchFeedback) {
        triggerHaptic(hapticType);
      }
      onClick?.(event);
    };

    return (
      <Button
        ref={ref}
        className={cn(
          touchFeedback && [
            'active:scale-95 transition-transform duration-100',
            'touch-manipulation select-none',
            'focus:ring-2 focus:ring-offset-2 focus:ring-primary/50',
            'active:shadow-inner'
          ],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';
