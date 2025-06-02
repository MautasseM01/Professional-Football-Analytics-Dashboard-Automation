
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";

export const AccessDenied = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-club-dark-bg p-4">
      <Card className="max-w-md w-full bg-club-black border-club-gold/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-club-gold">Access Denied</CardTitle>
          <CardDescription className="text-club-light-gray/70">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-club-light-gray/60">
            <p>Current role: <span className="text-club-gold font-medium">{profile?.role || 'Unknown'}</span></p>
            <p className="mt-2">Contact your administrator if you believe this is an error.</p>
          </div>
          <Button 
            onClick={handleGoBack}
            className="w-full bg-club-gold text-club-black hover:bg-club-gold/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
