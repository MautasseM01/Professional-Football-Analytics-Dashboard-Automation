
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [showBubble, setShowBubble] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    setShowBubble(true);
  };

  // Show initial French bubble when component mounts or language is fr
  useEffect(() => {
    if (language === 'fr') {
      setShowBubble(true);
    }
  }, [language]);

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  const getLanguageCode = (code: string) => {
    switch (code) {
      case 'ar': return 'AR';
      case 'en': return 'EN';
      case 'fr': return 'FR';
      default: return 'EN';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bubble */}
      {showBubble && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="relative bg-club-gold text-club-black px-2 py-1 rounded-md text-xs font-medium shadow-lg border border-club-gold/20 select-none">
            {getLanguageCode(language)}
            {/* Arrow below bubble */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full block w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-club-gold"></span>
          </div>
        </div>
      )}

      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-club-gold border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors bg-club-black/50 hover:border-club-gold/30 p-0 focus:outline-none focus:ring-0 relative select-none"
          // Remove the dropdown arrow (hide any svg added by SelectTrigger)
          style={{ minWidth: 0 }}
        >
          <SelectValue>
            <div className="flex items-center justify-center w-full h-full">
              {/* Use Lucide Globe icon. Use same sizing as ThemeToggle */}
              <Globe
                size={18}
                className="text-club-gold"
                strokeWidth={2}
                aria-label="Language selector"
              />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray min-w-[120px] sm:min-w-[140px] z-[99]">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="hover:bg-club-gold/10 hover:text-club-gold focus:bg-club-gold/10 focus:text-club-gold"
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Hide SelectTrigger's chevron arrow using style */}
      <style>
        {`
          .relative .flex.items-center.justify-center > svg + svg {
            display: none !important;
          }
          /* In case the SelectTrigger adds the arrow elsewhere, hide any direct svg except the first child (which is Globe) */
          .relative .flex.items-center.justify-center svg:not(:first-child) {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};
