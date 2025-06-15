
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, Star } from "lucide-react";

interface CoachFeedback {
  date: string;
  coach: string;
  feedback: string;
  rating: number;
}

interface CoachFeedbackTabProps {
  feedback: CoachFeedback[];
}

export const CoachFeedbackTab = ({ feedback }: CoachFeedbackTabProps) => {
  return (
    <div className="grid gap-4 sm:gap-6">
      {feedback.map((feedbackItem, index) => (
        <Card key={index} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-club-gold flex items-center gap-2 text-sm sm:text-base">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Feedback from {feedbackItem.coach}</span>
              </CardTitle>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${i < feedbackItem.rating ? 'text-club-gold fill-current' : 'text-club-light-gray/30'}`} 
                  />
                ))}
              </div>
            </div>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
              {new Date(feedbackItem.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-club-light-gray text-sm sm:text-base leading-relaxed">
              {feedbackItem.feedback}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
