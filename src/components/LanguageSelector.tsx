
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
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[100px] text-club-light-gray border-club-gold/20 hover:bg-club-gold/10 hover:text-club-gold transition-colors bg-transparent">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-sm">{currentLanguage?.flag}</span>
            <span className="text-xs font-medium">{currentLanguage?.code.toUpperCase()}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray min-w-[140px]">
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
