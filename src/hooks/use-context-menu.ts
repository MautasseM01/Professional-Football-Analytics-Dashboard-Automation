
import { useState, useCallback, useRef, useEffect } from 'react';
import { useHapticFeedback } from './use-haptic-feedback';

interface ContextMenuOption {
  label: string;
  icon?: React.ComponentType<any>;
  action: () => void;
  destructive?: boolean;
}

interface UseContextMenuProps {
  options: ContextMenuOption[];
  longPressDuration?: number;
}

export const useContextMenu = ({ options, longPressDuration = 500 }: UseContextMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { triggerHaptic } = useHapticFeedback();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setPosition({ x: touch.clientX, y: touch.clientY });
    
    timeoutRef.current = setTimeout(() => {
      triggerHaptic('medium');
      setIsVisible(true);
    }, longPressDuration);
  }, [longPressDuration, triggerHaptic]);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleOptionSelect = useCallback((option: ContextMenuOption) => {
    option.action();
    triggerHaptic('light');
    closeMenu();
  }, [triggerHaptic, closeMenu]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (isVisible) {
        closeMenu();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible, closeMenu]);

  return {
    isVisible,
    position,
    options,
    contextMenuProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    },
    handleOptionSelect,
    closeMenu
  };
};
