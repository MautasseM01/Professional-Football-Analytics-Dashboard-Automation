
import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface IOSSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export const IOSSearchBar = React.forwardRef<HTMLInputElement, IOSSearchBarProps>(({
  placeholder = "Search",
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const currentValue = value !== undefined ? value : internalValue;
  const isActive = isFocused || currentValue.length > 0;

  const handleFocus = () => {
    setIsFocused(true);
    triggerHaptic('selection');
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    const newValue = '';
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    triggerHaptic('light');
    inputRef.current?.focus();
  };

  return (
    <div className={cn(
      "relative w-full transition-all duration-300 ease-out",
      className
    )}>
      <div className={cn(
        "flex items-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl",
        "transition-all duration-300 ease-out",
        "border-2",
        isFocused 
          ? "border-[#007AFF] shadow-lg shadow-[#007AFF]/20 scale-[1.02]" 
          : "border-transparent shadow-md"
      )}>
        <div className="flex items-center justify-center w-10 h-12">
          <Search className={cn(
            "h-5 w-5 transition-colors duration-200",
            isFocused ? "text-[#007AFF]" : "text-[#8E8E93]"
          )} />
        </div>
        
        <input
          ref={ref || inputRef}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-0 outline-none",
            "text-[#1D1D1F] dark:text-[#F2F2F7] placeholder-[#8E8E93]",
            "text-base font-medium px-2 py-3",
            "transition-all duration-200 ease-out"
          )}
          style={{ fontSize: 'clamp(16px, 4vw, 17px)' }}
          {...props}
        />
        
        {currentValue.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "flex items-center justify-center w-10 h-12 mr-1",
              "text-[#8E8E93] hover:text-[#007AFF]",
              "transition-all duration-200 ease-out",
              "active:scale-90 rounded-full"
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
});

IOSSearchBar.displayName = "IOSSearchBar";
