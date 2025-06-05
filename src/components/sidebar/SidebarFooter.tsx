
import { MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarFooterProps {
  collapsed: boolean;
  onFeedbackClick: () => void;
}

export function SidebarFooter({ collapsed, onFeedbackClick }: SidebarFooterProps) {
  const { signOut, user } = useAuth();

  return (
    <div className="border-t border-club-gold/20 p-4">
      {!collapsed ? (
        <div className="flex flex-col space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onFeedbackClick}
            className="justify-start border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold"
          >
            <MessageSquare className="mr-2 h-4 w-4 text-club-gold" />
            <span>Send Feedback</span>
          </Button>
          
          <div className="text-sm text-club-light-gray truncate">
            {user?.email || "User"}
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="justify-center border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold w-full text-sm"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onFeedbackClick}
                className="h-12 w-12 p-0 justify-center items-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
              >
                <MessageSquare size={24} className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              Send Feedback
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={signOut}
                className="h-12 w-12 p-0 justify-center items-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
              >
                <LogOut size={24} className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              Sign out
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
