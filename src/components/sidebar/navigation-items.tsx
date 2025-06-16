
import { 
  LayoutDashboard, 
  UserRound, 
  Users, 
  FileBarChart, 
  Settings
} from "lucide-react";
import { AccessibleNavigationItem } from "@/utils/roleAccess";

export type { AccessibleNavigationItem as NavigationItem };

export const navigationItems: AccessibleNavigationItem[] = [
  { 
    name: "Dashboard Home", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    translationKey: "nav.dashboard",
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player', 'unassigned']
  },
  { 
    name: "Player Analysis", 
    href: "/player-analysis", 
    icon: UserRound,
    translationKey: "nav.playerAnalysis",
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player'],
    subItems: [
      { 
        name: "Individual Player Stats", 
        href: "/player-analysis/stats", 
        translationKey: "nav.individualStats",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']
      },
      { 
        name: "Player Comparison", 
        href: "/player-analysis/comparison", 
        translationKey: "nav.playerComparison",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach']
      },
      { 
        name: "Player Development", 
        href: "/player-analysis/development", 
        translationKey: "nav.playerDevelopment",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']
      },
      { 
        name: "Shot Map", 
        href: "/player-analysis/shot-map", 
        translationKey: "nav.shotMap",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach']
      },
      { 
        name: "Goals & Assists Analysis", 
        href: "/player-analysis/goals-assists", 
        translationKey: "nav.goalsAssists",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach']
      }
    ]
  },
  { 
    name: "Team Performance", 
    href: "/team-performance", 
    icon: Users,
    translationKey: "nav.teamPerformance",
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach'],
    subItems: [
      { 
        name: "Team Overview", 
        href: "/team-performance/overview", 
        translationKey: "nav.teamOverview",
        allowedRoles: ['admin', 'management', 'performance_director', 'coach']
      },
      { 
        name: "Team Tactical Analysis", 
        href: "/team-performance/tactical-analysis", 
        translationKey: "nav.tacticalAnalysis",
        allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach']
      }
    ]
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileBarChart,
    translationKey: "nav.reports",
    allowedRoles: ['admin', 'management', 'analyst']
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    translationKey: "nav.settings",
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']
  },
];
