
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlayerAtRisk } from "@/hooks/use-players-at-risk";

interface ComplianceData {
  compliance_score: number;
  points_deducted: number;
  admin_violations: string[];
  season: string;
}

export const ComplianceOverviewCard = () => {
  // Fetch compliance data from team_admin_status
  const { data: complianceData, isLoading: complianceLoading } = useQuery({
    queryKey: ['team-admin-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_admin_status')
        .select('*')
        .eq('season', '2024-25')
        .single();
      
      if (error) {
        console.error('Error fetching compliance data:', error);
        return null;
      }
      
      return data as ComplianceData;
    }
  });

  // Fetch players at risk count
  const { data: playersAtRisk } = useQuery({
    queryKey: ['players-at-risk-count'],
    queryFn: async () => {
      // Mock data for players at risk - replace with actual query when available
      return [
        { id: 1, riskLevel: 'HIGH' },
        { id: 2, riskLevel: 'SUSPENDED' },
        { id: 3, riskLevel: 'WARNING' }
      ] as PlayerAtRisk[];
    }
  });

  const getComplianceStatus = (score: number) => {
    if (score >= 80) {
      return {
        label: "Excellent Compliance",
        color: "text-green-400",
        bgColor: "border-green-400/30",
        circleColor: "stroke-green-400"
      };
    } else if (score >= 60) {
      return {
        label: "Attention Needed",
        color: "text-amber-400",
        bgColor: "border-amber-400/30",
        circleColor: "stroke-amber-400"
      };
    } else {
      return {
        label: "Urgent Action Required",
        color: "text-red-400",
        bgColor: "border-red-400/30",
        circleColor: "stroke-red-400"
      };
    }
  };

  const complianceScore = complianceData?.compliance_score || 0;
  const status = getComplianceStatus(complianceScore);
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (complianceScore / 100) * circumference;

  const metrics = [
    {
      title: "Compliance Score",
      value: `${complianceScore}%`,
      icon: <Shield className="w-4 h-4" />,
      color: status.color
    },
    {
      title: "Players at Risk",
      value: playersAtRisk?.length || 0,
      icon: <Users className="w-4 h-4" />,
      color: "text-amber-400"
    },
    {
      title: "Points Deducted",
      value: complianceData?.points_deducted || 0,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-red-400"
    },
    {
      title: "Active Violations",
      value: complianceData?.admin_violations?.length || 0,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-orange-400"
    }
  ];

  if (complianceLoading) {
    return (
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
          <CardTitle className="text-club-gold flex items-center text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
            <Shield className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
            Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Loading circle meter */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-club-gold/10" />
              <Skeleton className="h-4 w-32 mt-4 bg-club-gold/10" />
            </div>
            
            {/* Loading metrics */}
            <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 md:h-24 bg-club-gold/10" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${status.bgColor}`}>
      <CardHeader className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
        <CardTitle className="text-club-gold flex items-center text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
          <Shield className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          Compliance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Circular Compliance Meter */}
          <div className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-club-gold/20"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`${status.circleColor} transition-all duration-1000 ease-out`}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl md:text-3xl font-bold ${status.color}`}>
                  {complianceScore}%
                </span>
              </div>
            </div>
            <p className={`mt-3 md:mt-4 text-xs md:text-sm font-medium text-center ${status.color}`}>
              {status.label}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-club-black/50 border-club-gold/20 hover:border-club-gold/40 transition-colors">
                <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs xs:text-sm md:text-sm font-medium text-club-light-gray/80 leading-tight">
                        {metric.title}
                      </h3>
                    </div>
                    <div className={`${metric.color} flex-shrink-0 ml-2`}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className={`text-lg xs:text-xl md:text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
