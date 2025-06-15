
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
    <div className="grid gap-6">
      {feedback.map((feedbackItem, index) => (
        <Card key={index} className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-club-gold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback from {feedbackItem.coach}
              </CardTitle>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < feedbackItem.rating ? 'text-club-gold fill-current' : 'text-club-light-gray/30'}`} 
                  />
                ))}
              </div>
            </div>
            <CardDescription className="text-club-light-gray/70">
              <Calendar className="h-4 w-4 inline mr-1" />
              {new Date(feedbackItem.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-club-light-gray">{feedbackItem.feedback}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
