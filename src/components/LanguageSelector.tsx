
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
  };

  const getLanguageCode = (code: string) => {
    switch (code) {
      case 'ar': return 'Ar';
      case 'en': return 'En';
      case 'fr': return 'Fr';
      default: return 'En';
    }
  };

  // Dynamic positioning based on language
  const getBadgePositioning = () => {
    if (language === 'ar') {
      // For Arabic (RTL), keep badge on the right side
      return {
        className: "absolute -top-1 -right-1 sm:-top-0.5 sm:-right-0.5 z-10 pointer-events-none",
        transform: 'translate(50%, -50%)'
      };
    } else {
      // For French and English (LTR), move badge to the left side
      return {
        className: "absolute -top-1 -left-1 sm:-top-0.5 sm:-left-0.5 z-10 pointer-events-none",
        transform: 'translate(-50%, -50%)'
      };
    }
  };

  const badgePosition = getBadgePositioning();

  return (
    <div className="relative">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-club-gold border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors bg-club-black/50 hover:border-club-gold/30 p-0 focus:outline-none focus:ring-0 relative select-none"
          style={{ minWidth: 0 }}
        >
          <SelectValue>
            <div className="flex items-center justify-center w-full h-full">
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

      {/* External stylish language badge with dynamic positioning */}
      <div 
        className={badgePosition.className}
        style={{ transform: badgePosition.transform }}
      >
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-club-gold via-club-gold to-yellow-600 text-club-black flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg shadow-club-gold/30 border border-club-gold/20 ring-1 ring-white/40 transition-all duration-300"
          style={{
            lineHeight: "1",
            fontVariant: "small-caps",
          }}
          aria-live="polite"
        >
          {getLanguageCode(language)}
        </div>
      </div>

      {/* Hide SelectTrigger's chevron arrow using style */}
      <style>
        {`
          .relative .flex.items-center.justify-center > svg + svg {
            display: none !important;
          }
          .relative .flex.items-center.justify-center svg:not(:first-child) {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};
