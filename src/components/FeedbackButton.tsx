
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackForm } from "@/components/FeedbackForm";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border-club-gold/30 text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold"
      >
        <MessageSquare className="mr-1 h-4 w-4" />
        Feedback
      </Button>
      
      <FeedbackForm open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
