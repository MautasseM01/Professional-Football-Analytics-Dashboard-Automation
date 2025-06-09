
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define the feedback form schema using Zod
const feedbackFormSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
  page: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with current page URL
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      subject: "",
      feedback: "",
      page: location.pathname,
      email: "",
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Send feedback to Supabase
      const { error } = await supabase
        .from("user_feedback")
        .insert({
          subject: values.subject,
          feedback: values.feedback,
          page: values.page,
          email: values.email || null,
        });
      
      if (error) throw error;
      
      // Show success message
      toast.success("Thank you for your feedback!");
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-gold">Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What's this about?" 
                  {...field} 
                  className="bg-club-black/70 border-club-gold/30 text-club-light-gray focus:border-club-gold focus:ring-club-gold/20"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-gold">Your Feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please share your thoughts or suggestions..." 
                  {...field} 
                  className={`bg-club-black/70 border-club-gold/30 text-club-light-gray focus:border-club-gold focus:ring-club-gold/20 ${
                    isMobile ? 'min-h-[100px] text-base' : 'min-h-[120px]'
                  }`}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-gold">Page (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Which page is this about?" 
                  {...field} 
                  className="bg-club-black/70 border-club-gold/30 text-club-light-gray focus:border-club-gold focus:ring-club-gold/20"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-club-gold">Email (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Your email if you'd like us to follow up" 
                  {...field} 
                  className="bg-club-black/70 border-club-gold/30 text-club-light-gray focus:border-club-gold focus:ring-club-gold/20"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <div className={`flex gap-3 pt-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={`border-club-gold/30 text-club-light-gray hover:bg-club-gold/10 ${
              isMobile ? 'h-12 text-base' : ''
            }`}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`bg-club-gold hover:bg-club-gold/90 text-club-dark-bg ${
              isMobile ? 'h-12 text-base' : ''
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="bg-club-dark-gray border-club-gold/20 text-club-light-gray rounded-t-lg max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="text-club-gold text-lg">Submit Feedback</SheetTitle>
            <SheetDescription className="text-club-light-gray/70 text-sm">
              Your feedback helps us improve the platform for all users.
            </SheetDescription>
          </SheetHeader>
          <div className="pb-safe">
            <FormContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-club-dark-gray border-club-gold/20 text-club-light-gray">
        <DialogHeader>
          <DialogTitle className="text-club-gold">Submit Feedback</DialogTitle>
          <DialogDescription className="text-club-light-gray/70">
            Your feedback helps us improve the platform for all users.
          </DialogDescription>
        </DialogHeader>
        
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
