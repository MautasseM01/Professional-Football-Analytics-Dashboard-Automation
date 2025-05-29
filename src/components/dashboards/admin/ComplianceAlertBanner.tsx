
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ComplianceAlertBannerProps {
  complianceData: {
    complianceScore: number;
    pointsDeducted: number;
    highRiskCount: number;
  } | undefined;
  isLoading: boolean;
}

export const ComplianceAlertBanner = ({ complianceData, isLoading }: ComplianceAlertBannerProps) => {
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Check if compliance alert should be shown
  const shouldShowAlert = () => {
    if (alertDismissed || isLoading) return false;
    
    const complianceScore = complianceData?.complianceScore || 0;
    const pointsDeducted = complianceData?.pointsDeducted || 0;
    const highRiskCount = complianceData?.highRiskCount || 0;
    
    return complianceScore < 70 || pointsDeducted > 0 || highRiskCount > 2;
  };

  // Get alert severity and styling
  const getAlertSeverity = () => {
    const complianceScore = complianceData?.complianceScore || 0;
    const pointsDeducted = complianceData?.pointsDeducted || 0;
    
    if (complianceScore < 50 || pointsDeducted > 3) {
      return {
        severity: 'critical',
        bgColor: 'bg-red-600/90',
        borderColor: 'border-red-500',
        textColor: 'text-white'
      };
    }
    
    return {
      severity: 'warning',
      bgColor: 'bg-amber-600/90',
      borderColor: 'border-amber-500',
      textColor: 'text-white'
    };
  };

  if (!shouldShowAlert()) return null;

  const alertStyle = getAlertSeverity();

  return (
    <Alert className={`${alertStyle.bgColor} ${alertStyle.borderColor} ${alertStyle.textColor} border-2`}>
      <AlertTriangle className="h-5 w-5" />
      <div className="flex items-center justify-between w-full">
        <AlertDescription className="flex-1">
          <span className="font-semibold">⚠️ Compliance Alert:</span>{" "}
          {complianceData?.highRiskCount || 0} players at suspension risk, {complianceData?.pointsDeducted || 0} points deducted this season
        </AlertDescription>
        <div className="flex items-center space-x-2 ml-4">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlertDismissed(true)}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
