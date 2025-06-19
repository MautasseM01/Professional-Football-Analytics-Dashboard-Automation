
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BANNER_STORAGE_KEY = 'marketing-compliance-banner-dismissed';

export const MarketingComplianceBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
    setIsDismissed(dismissed === 'true');
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
  };

  const handleViewCompliance = () => {
    console.log("Navigate to compliance dashboard");
  };

  const handleScheduleDemo = () => {
    console.log("Open contact form for demo scheduling");
  };

  if (isDismissed) return null;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-club-gold via-amber-500 to-yellow-600 border-club-gold/30 mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Dismiss Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 text-club-black hover:bg-club-black/10 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="space-y-2 sm:space-y-3 pr-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-black leading-tight">
              Prevent Costly Administrative Errors That Cost Teams Promotion
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-club-black/80 font-medium">
              District League clubs lose 3+ points annually due to admin mistakes
            </p>
          </div>

          {/* Content Grid - Stack on mobile, side-by-side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left Side - Statistics */}
            <div className="space-y-4">
              {/* Statistics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-club-black/10 rounded-lg p-3 hover:bg-club-black/20 transition-colors">
                  <Shield className="h-5 w-5 text-club-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-club-black text-lg">73%</div>
                    <div className="text-xs text-club-black/70 leading-tight">violations are preventable</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-club-black/10 rounded-lg p-3 hover:bg-club-black/20 transition-colors">
                  <AlertTriangle className="h-5 w-5 text-club-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-club-black text-lg">3 pts</div>
                    <div className="text-xs text-club-black/70 leading-tight">average penalty</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-club-black/10 rounded-lg p-3 hover:bg-club-black/20 transition-colors">
                  <Trophy className="h-5 w-5 text-club-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-club-black text-lg">£50K+</div>
                    <div className="text-xs text-club-black/70 leading-tight">cost of missed promotion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Call to Actions */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-end">
                <Button
                  onClick={handleViewCompliance}
                  className="bg-club-black text-club-gold hover:bg-club-black/90 font-semibold px-6 py-2 h-auto transition-all duration-200 hover:scale-105"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  View Compliance Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleScheduleDemo}
                  className="border-club-black text-club-black hover:bg-club-black hover:text-club-gold font-semibold px-6 py-2 h-auto transition-all duration-200 hover:scale-105"
                >
                  Schedule Demo
                </Button>
              </div>
              
              <p className="text-xs text-club-black/60 text-center sm:text-right">
                Trusted by 200+ district league clubs
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
