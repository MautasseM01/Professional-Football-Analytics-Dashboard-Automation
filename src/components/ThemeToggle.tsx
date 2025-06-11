
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="text-club-gold border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors h-9 w-9 sm:h-10 sm:w-10 bg-club-black/50 hover:border-club-gold/30"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={16} className="sm:hidden" />
      ) : (
        <Sun size={16} className="sm:hidden" />
      )}
      {theme === 'light' ? (
        <Moon size={18} className="hidden sm:block" />
      ) : (
        <Sun size={18} className="hidden sm:block" />
      )}
    </Button>
  );
};
