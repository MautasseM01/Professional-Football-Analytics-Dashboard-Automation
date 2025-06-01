
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
    allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player']
  },
  { 
    name: "Player Analysis", 
    href: "/player-analysis", 
    icon: UserRound,
    translationKey: "nav.playerAnalysis",
    allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player'],
    subItems: [
      { 
        name: "Individual Player Stats", 
        href: "/player-analysis/stats", 
        translationKey: "nav.individualStats",
        allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player']
      },
      { 
        name: "Player Comparison", 
        href: "/player-analysis/comparison", 
        translationKey: "nav.playerComparison",
        allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director']
      },
      { 
        name: "Player Development", 
        href: "/player-analysis/development", 
        translationKey: "nav.playerDevelopment",
        allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director']
      },
      { 
        name: "Shot Map", 
        href: "/player-analysis/shot-map", 
        translationKey: "nav.shotMap",
        allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director']
      }
    ]
  },
  { 
    name: "Team Performance", 
    href: "/team-performance", 
    icon: Users,
    translationKey: "nav.teamPerformance",
    allowedRoles: ['admin', 'management'],
    subItems: [
      { 
        name: "Team Overview", 
        href: "/team-performance", 
        translationKey: "nav.teamOverview",
        allowedRoles: ['admin', 'management']
      },
      { 
        name: "Tactical Analysis", 
        href: "/team-performance/tactical-analysis", 
        translationKey: "nav.tacticalAnalysis",
        allowedRoles: ['admin', 'management']
      }
    ]
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileBarChart,
    translationKey: "nav.reports",
    allowedRoles: ['admin', 'management']
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    translationKey: "nav.settings",
    allowedRoles: ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player']
  },
];
