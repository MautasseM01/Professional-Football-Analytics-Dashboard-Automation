
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { AlertCircle, Mail, User2, HelpCircle } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnassignedRoleDashboardProps {
  profile: UserProfile;
}

export const UnassignedRoleDashboard = ({ profile }: UnassignedRoleDashboardProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-3 sm:space-y-4 max-w-4xl mx-auto ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'}`}>
      <Card className="bg-club-dark-gray border-club-gold/20 overflow-hidden">
        <div className={`bg-gradient-to-r from-club-gold/20 to-club-dark-gray flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${isMobile ? 'p-3' : 'p-3 sm:p-4 lg:p-6'}`}>
          <div className={`bg-club-gold/20 rounded-full flex-shrink-0 ${isMobile ? 'p-2' : 'p-3'}`}>
            <User2 className={`text-club-gold ${isMobile ? 'h-6 w-6' : 'h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8'}`} />
          </div>
          <div className="text-center sm:text-left min-w-0">
            <h1 className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl'}`}>
              Welcome to Striker Insights Arena
            </h1>
            <p className={`text-club-light-gray/80 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
              Your account has been created successfully
            </p>
          </div>
        </div>
        
        <CardContent className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isMobile ? 'p-3' : 'p-3 sm:p-4 lg:p-6'}`}>
          <div className={`flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-md ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <AlertCircle className={`flex-shrink-0 mt-0.5 text-amber-400 ${isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
            <div className="min-w-0">
              <h3 className={`font-medium text-amber-400 mb-1 ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Role Assignment Pending</h3>
              <p className={`text-club-light-gray/80 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
                Your account has been created, but a role has not yet been assigned to you. 
                Your access to features will be limited until an administrator assigns you the appropriate role.
              </p>
            </div>
          </div>
          
          <Card className="border-club-gold/10 bg-club-black/50">
            <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
              <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>What happens next?</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-3 sm:space-y-4 pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
              <div className="flex gap-3">
                <div className={`flex-shrink-0 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center font-medium ${isMobile ? 'w-6 h-6 text-sm' : 'w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm'}`}>1</div>
                <p className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
                  An administrator will review your account and assign you the appropriate role based on your position within the organization.
                </p>
              </div>
              <div className="flex gap-3">
                <div className={`flex-shrink-0 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center font-medium ${isMobile ? 'w-6 h-6 text-sm' : 'w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm'}`}>2</div>
                <p className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
                  Once your role is assigned, you will gain access to the relevant features and data for your position.
                </p>
              </div>
              <div className="flex gap-3">
                <div className={`flex-shrink-0 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center font-medium ${isMobile ? 'w-6 h-6 text-sm' : 'w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm'}`}>3</div>
                <p className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
                  You will receive an email notification when your account is fully set up.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <ResponsiveGrid 
            mobileCols={1}
            className={`grid-cols-1 sm:grid-cols-2 ${isMobile ? 'pt-3' : 'pt-4'}`}
          >
            <Button className={`bg-club-gold hover:bg-club-gold/90 text-club-black min-h-[44px] ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`} asChild>
              <a href="mailto:admin@strikerinsights.com">
                <Mail className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
                Contact Administrator
              </a>
            </Button>
            <Button variant="outline" className={`border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>
              <HelpCircle className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
              View Documentation
            </Button>
          </ResponsiveGrid>
          
          <div className={`border-t border-club-gold/10 mt-4 sm:mt-6 ${isMobile ? 'pt-3' : 'pt-4'}`}>
            <p className={`text-club-light-gray/60 text-center ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              If you believe this is an error or have any questions, please contact the system administrator at 
              <a href="mailto:admin@strikerinsights.com" className="text-club-gold hover:underline ml-1">admin@strikerinsights.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
