
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { RetroCard as RetroCardType } from "@/services/board.service";

interface RetroCardProps {
  card: RetroCardType;
  onVote: (cardId: string) => void;
}

const RetroCard: React.FC<RetroCardProps> = ({ card, onVote }) => {
  const { user } = useAuth();
  
  const hasVoted = user && card.voterIds.includes(user.id);
  
  // Format the time nicely
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Get the category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'bad':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'ideas':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'actions':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <Card className={`hover-card border-l-4 ${getCategoryColor(card.category)}`}>
      <CardContent className="p-4 pb-2">
        <p className="text-sm mb-2">{card.content}</p>
        {user?.isAdmin && (
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <span>By: {card.authorName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {formatTime(card.createdAt)}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-0 h-6 ${hasVoted ? 'text-primary' : ''}`}
            onClick={() => onVote(card.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>{card.votes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RetroCard;
