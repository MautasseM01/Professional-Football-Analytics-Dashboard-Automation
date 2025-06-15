
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  className?: string;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  description,
  showHomeButton = false,
  className = ""
}: ErrorFallbackProps) => {
  const errorMessage = error?.message || description || "An unexpected error occurred";

  return (
    <Card className={`border-red-500/20 bg-red-500/5 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        
        <div className="flex gap-2 flex-wrap">
          {resetErrorBoundary && (
            <Button 
              onClick={resetErrorBoundary}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
