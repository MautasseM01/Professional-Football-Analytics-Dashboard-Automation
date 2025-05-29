
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";

interface ComplianceMetricsCardsProps {
  complianceData: {
    complianceScore: number;
    pointsDeducted: number;
    highRiskCount: number;
  } | undefined;
  isLoading: boolean;
}

export const ComplianceMetricsCards = ({ complianceData, isLoading }: ComplianceMetricsCardsProps) => {
  // Helper functions for compliance score styling
  const getComplianceScoreColor = (score: number) => {
    if (score > 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getComplianceScoreBackground = (score: number) => {
    if (score > 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 bg-club-gold/10" />
        <Skeleton className="h-24 bg-club-gold/10" />
        <Skeleton className="h-24 bg-club-gold/10" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Compliance Score Card */}
      <Card className={`border-club-gold/20 ${getComplianceScoreBackground(complianceData?.complianceScore || 0)}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">Compliance Score</p>
              <p className={`text-2xl font-bold ${getComplianceScoreColor(complianceData?.complianceScore || 0)}`}>
                {complianceData?.complianceScore || 0}%
              </p>
            </div>
            <Shield className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>

      {/* High Risk Players Card */}
      <Card className={`border-club-gold/20 ${(complianceData?.highRiskCount || 0) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">High Risk Players</p>
              <p className={`text-2xl font-bold ${(complianceData?.highRiskCount || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {complianceData?.highRiskCount || 0}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>

      {/* Points Lost Card */}
      <Card className={`border-club-gold/20 ${(complianceData?.pointsDeducted || 0) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">Points Lost</p>
              <p className={`text-2xl font-bold ${(complianceData?.pointsDeducted || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {complianceData?.pointsDeducted || 0}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
