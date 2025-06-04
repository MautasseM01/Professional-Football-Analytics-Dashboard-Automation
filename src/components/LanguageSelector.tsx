
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors bg-transparent">
        <SelectValue>
          <div className="flex items-center justify-center">
            <span className="text-xs font-medium">
              {currentLanguage?.code.toUpperCase()}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray min-w-[120px] sm:min-w-[140px] z-50">
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
  );
};
