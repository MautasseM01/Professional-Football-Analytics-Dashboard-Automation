
import { MessageSquare, Settings } from "lucide-react";
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
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onFeedbackClick}
                className="w-full flex justify-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10 mb-2"
              >
                <MessageSquare size={20} />
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
                className="w-full flex justify-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
              >
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
              Sign out
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}
