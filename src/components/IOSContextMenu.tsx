
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ContextMenuOption {
  label: string;
  icon?: LucideIcon;
  action: () => void;
  destructive?: boolean;
}

interface IOSContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  options: ContextMenuOption[];
  onOptionSelect: (option: ContextMenuOption) => void;
  onClose: () => void;
}

export const IOSContextMenu = ({
  isVisible,
  position,
  options,
  onOptionSelect,
  onClose
}: IOSContextMenuProps) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[200px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        style={{
          left: Math.min(position.x, window.innerWidth - 220),
          top: Math.min(position.y, window.innerHeight - (options.length * 50 + 20)),
        }}
      >
        {options.map((option, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-12 rounded-none border-0",
              "hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
              "text-gray-900 dark:text-gray-100",
              option.destructive && "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
              index !== options.length - 1 && "border-b border-gray-200/30 dark:border-gray-700/30"
            )}
            onClick={() => onOptionSelect(option)}
          >
            {option.icon && <option.icon size={18} />}
            {option.label}
          </Button>
        ))}
      </div>
    </>
  );
};
