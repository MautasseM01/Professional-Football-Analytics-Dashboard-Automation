
import React from 'react';
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

  return (
    <div className="relative">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-club-gold border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors bg-club-black/50 hover:border-club-gold/30 p-0 focus:outline-none focus:ring-0 relative select-none"
          style={{ minWidth: 0 }}
        >
          <SelectValue>
            <div className="flex items-center justify-center w-full h-full relative">
              {/* Lucide globe icon */}
              <Globe
                size={18}
                className="text-club-gold"
                strokeWidth={2}
                aria-label="Language selector"
              />
              {/* Language code badge */}
              <span
                className="absolute -top-2 -right-2 sm:-top-1.5 sm:-right-1.5 bg-club-gold text-club-black rounded-full px-1 py-0.5 text-[10px] font-bold shadow ring-1 ring-club-gold/50 border border-white/40 select-none transition-all min-w-[18px] text-center pointer-events-none"
                style={{
                  lineHeight: "1",
                  fontVariant: "small-caps",
                }}
                aria-live="polite"
              >
                {getLanguageCode(language)}
              </span>
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
          .relative .flex.items-center.justify-center svg:not(:first-child) {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};
