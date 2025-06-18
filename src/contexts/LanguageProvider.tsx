
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  fr: {
    'nav.dashboard': 'Accueil du Tableau de Bord',
    'nav.playerAnalysis': 'Analyse des Joueurs',
    'nav.teamPerformance': 'Performance de l\'Équipe',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.individualStats': 'Statistiques Individuelles',
    'nav.playerComparison': 'Comparaison des Joueurs',
    'nav.playerDevelopment': 'Développement des Joueurs',
    'nav.shotMap': 'Carte des Tirs',
    'nav.teamOverview': 'Aperçu de l\'Équipe',
    'nav.tacticalAnalysis': 'Analyse Tactique',
    'header.title': 'Striker Insights Arena',
    'header.dashboard': 'Tableau de Bord'
  },
  en: {
    'nav.dashboard': 'Dashboard Home',
    'nav.playerAnalysis': 'Player Analysis',
    'nav.teamPerformance': 'Team Performance',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.individualStats': 'Individual Player Stats',
    'nav.playerComparison': 'Player Comparison',
    'nav.playerDevelopment': 'Player Development',
    'nav.shotMap': 'Shot Map',
    'nav.teamOverview': 'Team Overview',
    'nav.tacticalAnalysis': 'Tactical Analysis',
    'header.title': 'Striker Insights Arena',
    'header.dashboard': 'Dashboard'
  },
  ar: {
    'nav.dashboard': 'الصفحة الرئيسية',
    'nav.playerAnalysis': 'تحليل اللاعبين',
    'nav.teamPerformance': 'أداء الفريق',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.individualStats': 'إحصائيات اللاعبين الفردية',
    'nav.playerComparison': 'مقارنة اللاعبين',
    'nav.playerDevelopment': 'تطوير اللاعبين',
    'nav.shotMap': 'خريطة التسديد',
    'nav.teamOverview': 'نظرة عامة على الفريق',
    'nav.tacticalAnalysis': 'التحليل التكتيكي',
    'header.title': 'ستريكر إنسايتس أرينا',
    'header.dashboard': 'لوحة التحكم'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'fr'; // Default to French
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Apply text direction for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
