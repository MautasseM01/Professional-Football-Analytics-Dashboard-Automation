
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { AlertCircle, Mail, User2, HelpCircle } from "lucide-react";

interface UnassignedRoleDashboardProps {
  profile: UserProfile;
}

export const UnassignedRoleDashboard = ({ profile }: UnassignedRoleDashboardProps) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="bg-club-dark-gray border-club-gold/20 overflow-hidden">
        <div className="bg-gradient-to-r from-club-gold/20 to-club-dark-gray p-6 flex items-center gap-4">
          <div className="p-3 bg-club-gold/20 rounded-full">
            <User2 className="h-8 w-8 text-club-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-club-gold">
              Welcome to Striker Insights Arena
            </h1>
            <p className="text-club-light-gray/80">
              Your account has been created successfully
            </p>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-400 mb-1">Role Assignment Pending</h3>
              <p className="text-club-light-gray/80 text-sm">
                Your account has been created, but a role has not yet been assigned to you. 
                Your access to features will be limited until an administrator assigns you the appropriate role.
              </p>
            </div>
          </div>
          
          <Card className="border-club-gold/10 bg-club-black/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-club-gold">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center text-sm font-medium">1</div>
                <p className="text-club-light-gray">
                  An administrator will review your account and assign you the appropriate role based on your position within the organization.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center text-sm font-medium">2</div>
                <p className="text-club-light-gray">
                  Once your role is assigned, you will gain access to the relevant features and data for your position.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-club-gold/20 text-club-gold flex items-center justify-center text-sm font-medium">3</div>
                <p className="text-club-light-gray">
                  You will receive an email notification when your account is fully set up.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button className="bg-club-gold hover:bg-club-gold/90 text-club-black flex-1" asChild>
              <a href="mailto:admin@strikerinsights.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Administrator
              </a>
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 flex-1">
              <HelpCircle className="mr-2 h-4 w-4" />
              View Documentation
            </Button>
          </div>
          
          <div className="border-t border-club-gold/10 pt-4 mt-6">
            <p className="text-sm text-club-light-gray/60 text-center">
              If you believe this is an error or have any questions, please contact the system administrator at 
              <a href="mailto:admin@strikerinsights.com" className="text-club-gold hover:underline ml-1">admin@strikerinsights.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
