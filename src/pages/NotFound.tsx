
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-club-black p-4 text-center">
      <div className="w-24 h-24 mb-6">
        <img 
          src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
          alt="Club Logo" 
          className="w-full h-full"
        />
      </div>
      <h1 className="text-4xl font-bold text-club-gold">404</h1>
      <p className="text-xl text-club-light-gray mb-6">Page not found</p>
      <p className="text-club-light-gray/70 mb-8">The page you're looking for doesn't exist or has been moved</p>
      <Button asChild className="bg-club-gold text-club-black hover:bg-club-gold/80">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
