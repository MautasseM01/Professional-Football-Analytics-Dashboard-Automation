
# Football Analytics Application - Architectural Map

## 1. MAIN PAGES STRUCTURE

### Dashboard (`/dashboard`)
- **URL Route:** `/dashboard`
- **Main Purpose:** Role-based dashboard showing different views based on user role
- **Main Components:**
  - `PlayerDashboard` (for players)
  - `CoachDashboard` (for coaches) 
  - `AnalystDashboard` (for analysts)
  - `PerformanceDirectorDashboard` (for performance directors)
  - `ManagementDashboard` (for management)
  - `AdminDashboard` (for admins)
  - `UnassignedRoleDashboard` (for unassigned users)
  - `RoleTester` (demo component)
- **Data Hooks:** `usePlayerData`, `useUserProfile`
- **Database Tables:** `users`, `players`, various performance tables based on role

### Player Stats (`/player-analysis`, `/player-analysis/stats`)
- **URL Route:** `/player-analysis`, `/player-analysis/stats`
- **Main Purpose:** Individual player performance analysis and statistics
- **Main Components:**
  - `PlayerSelector`
  - `PlayerStats`
  - `RoleBasedContent`
- **Data Hooks:** `usePlayerData`, `useUserProfile`
- **Database Tables:** `players`, `player_match_performance`, `player_attributes`, `goals`, `assists`

### Player Comparison (`/player-analysis/comparison`)
- **URL Route:** `/player-analysis/comparison`
- **Main Purpose:** Compare up to 4 players across performance metrics
- **Main Components:**
  - `PlayerSelectionCard`
  - `ProfessionalPerformanceTable`
  - `PerformanceRadarChart`
- **Data Hooks:** `useRealPlayers`
- **Database Tables:** `players`, `player_season_stats`

### Player Development (`/player-analysis/development`)
- **URL Route:** `/player-analysis/development`
- **Main Purpose:** Track player development goals and progress
- **Main Components:**
  - `PlayerSelector`
  - `PlayerDevelopmentTabs`
  - `DevelopmentPathwayVisualizer`
  - `DevelopmentMilestonesTimeline`
  - `PlayerDevelopmentInsights`
- **Data Hooks:** `usePlayerData`, `useDevelopmentData`
- **Database Tables:** `players`, `player_development_goals`, `player_development_milestones`, `player_development_pathways`

### Shot Map (`/player-analysis/shot-map`)
- **URL Route:** `/player-analysis/shot-map`
- **Main Purpose:** Visualize shot patterns and outcomes on a football pitch
- **Main Components:**
  - `ShotMapFilters`
  - `ShotMapVisualization`
  - `ShotMapLegend`
- **Data Hooks:** `usePlayerData`, `useShotsData`
- **Database Tables:** `shots`, `matches`, `players`

### Goals & Assists Analysis (`/player-analysis/goals-assists`)
- **URL Route:** `/player-analysis/goals-assists`
- **Main Purpose:** Comprehensive analysis of goals and assists performance
- **Main Components:**
  - `PlayerSelector`
  - `GoalsTimeline`
  - `GoalTypesAnalysis`
  - `BodyPartAnalysis`
  - `AssistNetwork`
  - `GoalCoordinatesHeatmap`
  - `AssistTypesBreakdown`
  - `PartnershipAnalysis`
- **Data Hooks:** `useRealPlayers`, `useGoalsData`
- **Database Tables:** `goals`, `assists`, `players`

### Team Overview (`/team-performance/overview`)
- **URL Route:** `/team-performance/overview`
- **Main Purpose:** Overall team performance metrics and analysis
- **Main Components:** Team-specific components (not detailed in provided files)
- **Data Hooks:** Team-related hooks
- **Database Tables:** `matches`, `player_match_performance`, team aggregated data

### Tactical Analysis (`/team-performance/tactical-analysis`)
- **URL Route:** `/team-performance/tactical-analysis`
- **Main Purpose:** Team tactical analysis and formation insights
- **Main Components:** Tactical analysis components
- **Data Hooks:** Tactical data hooks
- **Database Tables:** `starting_eleven`, `match_passes`, tactical data

### Points Deduction Tracker (`/team-performance/points-deductions`)
- **URL Route:** `/team-performance/points-deductions`
- **Main Purpose:** Track disciplinary issues and points deductions
- **Main Components:** Points deduction tracking components
- **Data Hooks:** Compliance data hooks
- **Database Tables:** `team_admin_status`, `player_disciplinary`

### Login (`/login`)
- **URL Route:** `/login`
- **Main Purpose:** User authentication
- **Main Components:** Login form components
- **Data Hooks:** Authentication hooks
- **Database Tables:** `auth.users`, `users`

## 2. COMPONENT HIERARCHY

### Core Layout Components

#### `DashboardSidebar`
- **Used By:** All main pages
- **Purpose:** Navigation menu with role-based access
- **Child Components:** `SidebarNavItem`, `SidebarFooter`
- **Data Dependencies:** User role, navigation items

#### `DashboardLayout`
- **Used By:** Most analysis pages
- **Purpose:** Consistent page layout with header and navigation
- **Child Components:** Header controls, refresh buttons
- **Data Dependencies:** Page title, description

### Player Analysis Components

#### `PlayerSelector`
- **Used By:** PlayerStats, PlayerDevelopment, GoalsAssistsAnalysis
- **Purpose:** Select a player from available list
- **Data Requirements:** `players[]`, `selectedPlayer`, `onPlayerSelect`
- **Role Restrictions:** Hidden for player role (they see only their own data)

#### `PlayerStats`
- **Used By:** PlayerStats page, AnalystDashboard
- **Purpose:** Comprehensive player statistics display
- **Child Components:**
  - `PlayerProfileCard`
  - `PlayerStatCards`
  - `PlayerPerformanceSection`
  - `GoalsBreakdownCard`
  - `DetailedAttributesCard`
  - `MatchByMatchCard`
  - `PlayerHeatmapSection`
  - `PlayerTackleSuccessSection`
- **Analyst Mode Components:**
  - `AnalystPlayerFilters`
  - `BenchmarkComparisonCard`
  - `PredictiveAnalyticsCard`
  - `PlayerExportDialog`

#### `OptimizedAnalystDashboard`
- **Used By:** AnalystDashboard
- **Purpose:** High-performance analytics dashboard for large datasets
- **Child Components:**
  - `OptimizedDataTable`
  - `ProgressiveDataLoader`
  - `AdvancedExportDialog`
  - `ScheduledReportsManager`
- **Performance Features:** Virtualization, debounced search, progressive loading

### Shared Utility Components

#### `RoleBasedContent`
- **Used By:** Multiple pages and components
- **Purpose:** Conditional rendering based on user role
- **Props:** `allowedRoles[]`, `children`, `fallback`

#### `TouchFeedbackButton`
- **Used By:** Throughout application
- **Purpose:** Enhanced button with haptic feedback
- **Variants:** Multiple button styles and sizes

#### `ResponsiveGrid`
- **Used By:** Multiple analysis pages
- **Purpose:** Responsive grid layout for cards/components
- **Props:** `minCardWidth`, `className`

#### `ErrorBoundary`
- **Used By:** Critical components
- **Purpose:** Error handling and fallback UI
- **Fallback:** `ErrorFallback` component

## 3. ROLE-BASED ACCESS MATRIX

| Page/Feature | Player | Coach | Analyst | Perf. Director | Management | Admin | Unassigned |
|--------------|--------|-------|---------|----------------|------------|-------|------------|
| **Dashboard** | ✅ Own data | ✅ Team data | ✅ Analytics | ✅ Performance | ✅ Management | ✅ All access | ✅ Limited |
| **Player Stats** | ✅ Own only | ✅ All players | ✅ All players | ✅ All players | ✅ All players | ✅ All players | ❌ |
| **Player Comparison** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Player Development** | ✅ Own goals | ✅ Set goals | ✅ Analysis | ✅ Pathways | ✅ Overview | ✅ All access | ❌ |
| **Shot Map** | ✅ Own shots | ✅ Team shots | ✅ All data | ✅ All data | ✅ All data | ✅ All access | ❌ |
| **Goals/Assists Analysis** | ✅ Own data | ✅ Team data | ✅ All data | ✅ All data | ✅ All data | ✅ All access | ❌ |
| **Team Performance** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Tactical Analysis** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Points Deductions** | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Advanced Analytics** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **User Management** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

### Role-Specific Features

#### Player Role
- Can only see their own data
- Cannot access player selector (auto-selected)
- Limited to personal development goals
- No access to team-wide analytics

#### Coach Role
- Access to all team players
- Can set development goals
- Team performance access
- Disciplinary tracking access

#### Analyst Role
- Advanced analytics dashboard
- Export capabilities
- Scheduled reports
- Benchmark comparisons
- Predictive analytics

#### Performance Director Role
- Executive summary views
- Development pathways
- Performance benchmarking
- Squad availability calendar

#### Management Role
- Strategic overview
- Compliance features
- Points deduction tracking
- High-level metrics

#### Admin Role
- Full system access
- User management
- System administration
- Data pipeline status

## 4. SHARED COMPONENTS ANALYSIS

### Multi-Page Components

#### `PlayerSelector`
- **Pages:** PlayerStats, PlayerDevelopment, GoalsAssistsAnalysis, ShotMap
- **Functionality:** Player selection with search and filtering
- **Role Behavior:** Hidden for player role
- **Data Source:** `usePlayerData` hook

#### `BackToTopButton`
- **Pages:** All main pages
- **Functionality:** Smooth scroll to top
- **Universal component with no role restrictions

#### Navigation Components
- **`DashboardSidebar`:** All pages
- **`ThemeToggle`:** All pages  
- **`LanguageSelector`:** All pages
- **Role-based menu items and access control

### Chart/Visualization Components
- **`PerformanceRadarChart`:** Player comparison, various analysis pages
- **`ResponsiveChartContainer`:** Multiple chart implementations
- **`ChartSkeleton`:** Loading states across chart components

### Data Management Patterns

#### Hooks Usage Patterns
- **`usePlayerData`:** Core player data across multiple pages
- **`useUserProfile`:** Role-based access control everywhere
- **`useOptimizedAnalytics`:** Large dataset handling in analyst features
- **`useDebounce`:** Search optimization in data-heavy components

#### Database Access Patterns
- **Player-centric queries:** Most pages query `players` table as primary
- **Performance data:** `player_match_performance` for statistics
- **Match data:** `matches` table for contextual information
- **Development tracking:** Specialized tables for goals and milestones

## 5. DATA FLOW ARCHITECTURE

### Authentication Flow
1. User logs in → `AuthContext` manages session
2. `useUserProfile` fetches user role from `users` table
3. Role determines dashboard type and component access
4. `RoleBasedContent` conditionally renders features

### Player Data Flow
1. `usePlayerData` hook fetches available players based on role
2. Player selection triggers detailed data fetching
3. Multiple specialized hooks fetch related data (goals, performance, etc.)
4. Components receive typed player data and render accordingly

### Performance Optimization Strategies
1. **React Query caching:** Prevents redundant API calls
2. **Virtualization:** `react-window` for large lists
3. **Progressive loading:** Staged data loading with skeleton states
4. **Debounced search:** Reduces API calls during user input
5. **Memory management:** Proper cleanup of large datasets

## 6. SECURITY AND ACCESS CONTROL

### Route Protection
- **`ProtectedRoute`:** Basic authentication check
- **`RoleProtectedRoute`:** Role-based route access
- **`RouteProtection`:** Dynamic route validation

### Component-Level Security
- **`RoleBasedContent`:** Conditional rendering
- **Database RLS:** Row-level security (needs implementation)
- **API access control:** Hook-level permission checks

### Data Visibility Rules
- **Players:** Own data only
- **Coaches:** Team data access
- **Analysts:** Full analytical access
- **Management/Admin:** System-wide access
- **Unassigned:** Dashboard only with limited features

This architectural map provides a comprehensive overview of the application structure, showing how components, data, and roles interact throughout the system.
