
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
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.playerAnalysis': 'Analyse des Joueurs',
    'nav.teamPerformance': 'Performance de l\'Équipe',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.individualStats': 'Statistiques Individuelles',
    'nav.playerStats': 'Statistiques Joueur',
    'nav.playerComparison': 'Comparaison des Joueurs',
    'nav.playerDevelopment': 'Développement des Joueurs',
    'nav.shotMap': 'Carte des Tirs',
    'nav.teamOverview': 'Aperçu de l\'Équipe',
    'nav.tacticalAnalysis': 'Analyse Tactique',
    'nav.pointsDeductions': 'Pénalités de Points',
    'nav.matchDataImport': 'Import Données Match',
    'nav.goalsAssists': 'Buts et Passes Décisives',
    'header.title': 'Striker Insights Arena',
    'header.dashboard': 'Tableau de Bord',

    // Common Actions & UI
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.refresh': 'Actualiser',
    'common.export': 'Exporter',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.select': 'Sélectionner',
    'common.selectPlayer': 'Sélectionner un joueur',
    'common.noData': 'Aucune donnée disponible',
    'common.toggleSidebar': 'Basculer la barre latérale',
    'common.refreshData': 'Actualiser les données',

    // Player-specific terms
    'player.position': 'Position',
    'player.age': 'Âge',
    'player.height': 'Taille',
    'player.weight': 'Poids',
    'player.nationality': 'Nationalité',
    'player.goals': 'Buts',
    'player.assists': 'Passes décisives',
    'player.matches': 'Matchs',
    'player.matchesPlayed': 'Matchs joués',
    'player.goalsScored': 'Buts marqués',
    'player.matchRating': 'Note du match',
    'player.passAccuracy': 'Précision des passes',
    'player.shotsOnTarget': 'Tirs cadrés',
    'player.distanceCovered': 'Distance parcourue',
    'player.tackles': 'Tacles',
    'player.interceptions': 'Interceptions',
    'player.fouls': 'Fautes',
    'player.yellowCards': 'Cartons jaunes',
    'player.redCards': 'Cartons rouges',
    'player.manOfMatch': 'Homme du match',
    'player.conversionRate': 'Taux de conversion',
    'player.aerialDuels': 'Duels aériens',
    'player.keyPasses': 'Passes clés',
    'player.saves': 'Arrêts',
    'player.cleanSheets': 'Cages inviolées',
    'player.distribution': 'Distribution',

    // Dashboard sections
    'dashboard.teamMetrics': 'Métriques Équipe',
    'dashboard.playerPerformance': 'Performance Joueur',
    'dashboard.recentMatches': 'Matchs Récents',
    'dashboard.upcomingFixtures': 'Prochains Matchs',
    'dashboard.squadOverview': 'Aperçu Effectif',
    'dashboard.injuryList': 'Liste Blessures',
    'dashboard.trainingSchedule': 'Programme Entraînement',
    'dashboard.complianceAlerts': 'Alertes Conformité',
    'dashboard.systemStatus': 'État Système',
    'dashboard.analyticsOverview': 'Aperçu Analytique',
    'dashboard.executiveSummary': 'Résumé Exécutif',
    'dashboard.strategicOverview': 'Vue Stratégique',

    // Match contexts
    'match.home': 'Domicile',
    'match.away': 'Extérieur',
    'match.neutral': 'Terrain neutre',
    'match.win': 'Victoire',
    'match.loss': 'Défaite',
    'match.draw': 'Match nul',
    'match.upcoming': 'À venir',
    'match.completed': 'Terminé',
    'match.cancelled': 'Annulé',
    'match.postponed': 'Reporté',

    // Formations & Tactics
    'formation.442': '4-4-2',
    'formation.433': '4-3-3',
    'formation.352': '3-5-2',
    'formation.451': '4-5-1',
    'formation.343': '3-4-3',
    'formation.532': '5-3-2',
    'tactics.formation': 'Formation tactique',
    'tactics.passingNetwork': 'Réseau de passes',
    'tactics.heatmap': 'Carte de chaleur',
    'tactics.analysis': 'Analyse tactique',

    // Positions
    'position.goalkeeper': 'Gardien',
    'position.defender': 'Défenseur',
    'position.midfielder': 'Milieu de terrain',
    'position.forward': 'Attaquant',
    'position.striker': 'Buteur',
    'position.winger': 'Ailier',
    'position.fullback': 'Arrière latéral',
    'position.centerback': 'Défenseur central',
    'position.defensiveMidfielder': 'Milieu défensif',
    'position.attackingMidfielder': 'Milieu offensif',

    // Time periods
    'time.season': 'Saison',
    'time.month': 'Mois',
    'time.week': 'Semaine',
    'time.last30days': '30 derniers jours',
    'time.last7days': '7 derniers jours',
    'time.thisMonth': 'Ce mois',
    'time.lastMonth': 'Mois dernier',
    'time.thisSeason': 'Cette saison',
    'time.lastSeason': 'Saison dernière',

    // Reports & Analytics
    'reports.generate': 'Générer rapport',
    'reports.export': 'Exporter rapport',
    'reports.performance': 'Rapport performance',
    'reports.tactical': 'Rapport tactique',
    'reports.individual': 'Rapport individuel',
    'reports.team': 'Rapport équipe',
    'reports.development': 'Rapport développement',
    'reports.injury': 'Rapport blessures',
    'analytics.advanced': 'Analyses avancées',
    'analytics.predictive': 'Analyses prédictives',
    'analytics.benchmark': 'Analyse comparative',
    'analytics.trends': 'Tendances',

    // User roles & permissions
    'role.player': 'Joueur',
    'role.coach': 'Entraîneur',
    'role.analyst': 'Analyste',
    'role.performanceDirector': 'Directeur Performance',
    'role.management': 'Direction',
    'role.admin': 'Administrateur',
    'role.unassigned': 'Non assigné',

    // Login & Authentication
    'auth.welcomeBack': 'Bon retour',
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.showPassword': 'Afficher le mot de passe',
    'auth.hidePassword': 'Masquer le mot de passe',
    'auth.signInWithGoogle': 'Se connecter avec Google',
    'auth.loggingIn': 'Connexion...',
    'auth.registering': 'Inscription...',

    // Errors & Messages
    'error.failedToLoad': 'Échec du chargement',
    'error.failedToLoadPlayerData': 'Échec du chargement des données joueur',
    'error.noPlayerSelected': 'Aucun joueur sélectionné',
    'error.noDataAvailable': 'Aucune donnée disponible',
    'message.selectPlayerToView': 'Sélectionnez un joueur pour voir ses statistiques',
    'message.loadingPlayerProfile': 'Chargement du profil joueur...',
    'message.dataRefreshed': 'Données actualisées avec succès',
    'message.exportSuccess': 'Export réussi',
    'message.savingData': 'Sauvegarde des données...',

    // Performance metrics
    'metrics.goals': 'Buts',
    'metrics.assists': 'Passes décisives',
    'metrics.shots': 'Tirs',
    'metrics.shotsOnTarget': 'Tirs cadrés',
    'metrics.passes': 'Passes',
    'metrics.passAccuracy': 'Précision passes',
    'metrics.tackles': 'Tacles',
    'metrics.interceptions': 'Interceptions',
    'metrics.clearances': 'Dégagements',
    'metrics.blocks': 'Blocages',
    'metrics.fouls': 'Fautes',
    'metrics.offsides': 'Hors-jeu',
    'metrics.corners': 'Corners',
    'metrics.freeKicks': 'Coups francs',
    'metrics.penalties': 'Penalties',
    'metrics.crossAccuracy': 'Précision centres',
    'metrics.dribblesCompleted': 'Dribbles réussis',
    'metrics.aerialWins': 'Duels aériens gagnés',
    'metrics.recoveries': 'Récupérations',
    'metrics.possessionWon': 'Possession gagnée',
    'metrics.possessionLost': 'Possession perdue',

    // Squad management
    'squad.size': 'Taille effectif',
    'squad.available': 'Joueurs disponibles',
    'squad.injured': 'Blessés',
    'squad.suspended': 'Suspendus',
    'squad.training': 'Entraînement',
    'squad.attendance': 'Présence',
    'squad.fitness': 'Condition physique',
    'squad.development': 'Développement',
    'squad.planning': 'Planification effectif',

    // Development & Training
    'development.goals': 'Objectifs développement',
    'development.progress': 'Progrès',
    'development.milestones': 'Étapes importantes',
    'development.pathways': 'Parcours développement',
    'development.assessment': 'Évaluation',
    'development.feedback': 'Retours',
    'development.plan': 'Plan développement',
    'training.schedule': 'Programme entraînement',
    'training.intensity': 'Intensité',
    'training.load': 'Charge entraînement',
    'training.recovery': 'Récupération',

    // Injuries & Medical
    'injury.type': 'Type blessure',
    'injury.severity': 'Gravité',
    'injury.expectedReturn': 'Retour prévu',
    'injury.treatment': 'Traitement',
    'injury.status': 'Statut',
    'injury.active': 'Active',
    'injury.recovering': 'En récupération',
    'injury.minor': 'Mineure',
    'injury.moderate': 'Modérée',
    'injury.major': 'Majeure',
    'medical.fitness': 'Condition physique',
    'medical.clearance': 'Autorisation médicale',

    // Disciplinary
    'disciplinary.yellowCard': 'Carton jaune',
    'disciplinary.redCard': 'Carton rouge',
    'disciplinary.suspension': 'Suspension',
    'disciplinary.fine': 'Amende',
    'disciplinary.warning': 'Avertissement',
    'disciplinary.record': 'Dossier disciplinaire',

    // Mobile & Responsive
    'mobile.rotateDevice': 'Pour une meilleure visualisation des graphiques, essayez de faire pivoter votre appareil en mode paysage.',
    'mobile.touchHint': 'Appuyez pour plus de détails',

    // Chart & Visualization labels
    'chart.goals': 'Buts',
    'chart.assists': 'Passes décisives',
    'chart.performance': 'Performance',
    'chart.timeline': 'Chronologie',
    'chart.comparison': 'Comparaison',
    'chart.trend': 'Tendance',
    'chart.distribution': 'Distribution',
    'chart.average': 'Moyenne',
    'chart.total': 'Total',
    'chart.percentage': 'Pourcentage',

    // Settings
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.profile': 'Profil',
    'settings.preferences': 'Préférences',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.account': 'Compte',

    // Page titles and descriptions
    'page.dashboard.title': 'Tableau de Bord',
    'page.dashboard.description': 'Vue d\'ensemble des performances et métriques clés',
    'page.playerStats.title': 'Statistiques Joueur',
    'page.playerStats.description': 'Analysez les performances individuelles et les statistiques',
    'page.playerComparison.title': 'Comparaison Joueurs',
    'page.playerComparison.description': 'Comparez jusqu\'à 4 joueurs selon diverses métriques',
    'page.playerDevelopment.title': 'Développement Joueur',
    'page.playerDevelopment.description': 'Suivi du développement et des objectifs des joueurs',
    'page.shotMap.title': 'Carte des Tirs',
    'page.shotMap.description': 'Visualisez et analysez les modèles et résultats de tirs',
    'page.goalsAssists.title': 'Buts et Passes Décisives',
    'page.goalsAssists.description': 'Analyse complète des performances en buts et passes décisives',
    'page.teamOverview.title': 'Aperçu Équipe',
    'page.teamOverview.description': 'Vue d\'ensemble des performances et statistiques de l\'équipe',
    'page.tacticalAnalysis.title': 'Analyse Tactique',
    'page.tacticalAnalysis.description': 'Analyse tactique approfondie et insights stratégiques',
    'page.pointsDeductions.title': 'Pénalités de Points',
    'page.pointsDeductions.description': 'Suivi et analyse de l\'impact des pénalités administratives',
    'page.matchDataImport.title': 'Import Données Match',
    'page.matchDataImport.description': 'Importez et gérez les données de match'
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
