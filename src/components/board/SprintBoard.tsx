
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SprintBoard as SprintBoardType } from "@/services/board.service";

interface SprintBoardProps {
  board: SprintBoardType;
}

const SprintBoard: React.FC<SprintBoardProps> = ({ board }) => {
  const navigate = useNavigate();
  
  const handleBoardClick = () => {
    navigate(`/board/${board.id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      className="retro-card cursor-pointer transition-all duration-200 overflow-hidden"
      onClick={handleBoardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{board.name}</CardTitle>
            <CardDescription>{formatDate(board.date)}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            {board.team}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {board.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <div className="text-sm text-muted-foreground">
          {board.cards.length} card{board.cards.length !== 1 ? 's' : ''}
        </div>
        <Button size="sm" variant="ghost" onClick={(e) => {
          e.stopPropagation();
          navigate(`/board/${board.id}`);
        }}>
          Open Board
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SprintBoard;
