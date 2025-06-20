
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  Home,
  UserCheck,
  Target,
  Activity,
  Map,
  Zap,
  Shield,
  Upload,
  AlertTriangle
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  allowedRoles: UserRole[];
  translationKey: string;
  subItems?: {
    name: string;
    href: string;
    allowedRoles: UserRole[];
    translationKey: string;
  }[];
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false,
    allowedRoles: ['player', 'coach', 'analyst', 'performance_director', 'management', 'admin'],
    translationKey: 'nav.dashboard',
  },
  {
    name: 'Player Analysis',
    href: '/player-analysis',
    icon: UserCheck,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
    translationKey: 'nav.playerAnalysis',
    subItems: [
      {
        name: 'Player Stats',
        href: '/player-analysis/stats',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.playerStats',
      },
      {
        name: 'Player Comparison',
        href: '/player-analysis/comparison',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.playerComparison',
      },
      {
        name: 'Player Development',
        href: '/player-analysis/development',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.playerDevelopment',
      },
      {
        name: 'Shot Map',
        href: '/player-analysis/shot-map',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.shotMap',
      },
      {
        name: 'Goals & Assists',
        href: '/player-analysis/goals-assists',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.goalsAssists',
      },
    ],
  },
  {
    name: 'Team Performance',
    href: '/team-performance',
    icon: Users,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
    translationKey: 'nav.teamPerformance',
    subItems: [
      {
        name: 'Team Overview',
        href: '/team-performance/overview',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.teamOverview',
      },
      {
        name: 'Tactical Analysis',
        href: '/team-performance/tactical-analysis',
        allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
        translationKey: 'nav.tacticalAnalysis',
      },
      {
        name: 'Points Deductions',
        href: '/team-performance/points-deductions',
        allowedRoles: ['coach', 'management', 'admin'],
        translationKey: 'nav.pointsDeductions',
      },
    ],
  },
  {
    name: 'Match Data Import',
    href: '/match-data-import',
    icon: Upload,
    current: false,
    allowedRoles: ['coach', 'analyst', 'management', 'admin'],
    translationKey: 'nav.matchDataImport',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    current: false,
    allowedRoles: ['coach', 'analyst', 'performance_director', 'management', 'admin'],
    translationKey: 'nav.reports',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: false,
    allowedRoles: ['player', 'coach', 'analyst', 'performance_director', 'management', 'admin'],
    translationKey: 'nav.settings',
  },
];
