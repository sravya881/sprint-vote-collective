
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import RetroCard from "@/components/board/RetroCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { boardService, SprintBoard, RetroCard as RetroCardType } from "@/services/board.service";
import { toast } from "sonner";

const SprintDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState<SprintBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardCategory, setNewCardCategory] = useState<"good" | "bad" | "ideas" | "actions">("good");
  const [newCardContent, setNewCardContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchBoard = async () => {
      if (!boardId) return;
      
      setIsLoading(true);
      try {
        const data = await boardService.getBoardById(boardId);
        if (data) {
          setBoard(data);
        } else {
          toast.error("Sprint board not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching board:", error);
        toast.error("Failed to load sprint board");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBoard();
  }, [boardId, navigate]);
  
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!board || !user) return;
    
    setIsSubmitting(true);
    try {
      await boardService.addCard(board.id, {
        content: newCardContent,
        category: newCardCategory,
        authorId: user.id,
        authorName: user.name
      });
      
      // Refresh board data
      const updatedBoard = await boardService.getBoardById(board.id);
      if (updatedBoard) {
        setBoard(updatedBoard);
      }
      
      setIsAddCardOpen(false);
      setNewCardContent("");
      toast.success("Card added successfully");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleVote = async (cardId: string) => {
    if (!board || !user) return;
    
    try {
      await boardService.voteCard(board.id, cardId, user.id);
      
      // Refresh board data
      const updatedBoard = await boardService.getBoardById(board.id);
      if (updatedBoard) {
        setBoard(updatedBoard);
      }
    } catch (error) {
      console.error("Error voting for card:", error);
      toast.error("Failed to vote for card");
    }
  };
  
  const filterCards = (cards: RetroCardType[], category: string) => {
    if (category === "all") return cards;
    return cards.filter(card => card.category === category);
  };
  
  // Format the date nicely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AppLayout showSidebar={false}>
      <div className="animate-fade-in">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            <div className="h-10 w-1/3 bg-muted/40 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-muted/40 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted/40 rounded animate-pulse mt-4" />
          </div>
        ) : board ? (
          <>
            <div className="mb-8">
              <Button 
                variant="ghost" 
                className="mb-4" 
                onClick={() => navigate("/dashboard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </Button>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{board.name}</h1>
                  <p className="text-muted-foreground">
                    {formatDate(board.date)} • {board.team} Team
                  </p>
                  {board.description && (
                    <p className="mt-2 text-muted-foreground max-w-3xl">
                      {board.description}
                    </p>
                  )}
                </div>
                <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                  <DialogTrigger asChild>
                    <Button className="shrink-0 button-glow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass-card">
                    <DialogHeader>
                      <DialogTitle>Add Retrospective Card</DialogTitle>
                      <DialogDescription>
                        Share your thoughts about the sprint
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCard} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Tabs 
                          defaultValue="good" 
                          value={newCardCategory}
                          onValueChange={(value) => setNewCardCategory(value as any)}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-4">
                            <TabsTrigger value="good">Good</TabsTrigger>
                            <TabsTrigger value="bad">Bad</TabsTrigger>
                            <TabsTrigger value="ideas">Ideas</TabsTrigger>
                            <TabsTrigger value="actions">Actions</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Card Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Enter your thoughts here..."
                          value={newCardContent}
                          onChange={(e) => setNewCardContent(e.target.value)}
                          required
                          className="resize-none h-32 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddCardOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Adding..." : "Add Card"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="mb-8"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="good">Good</TabsTrigger>
                <TabsTrigger value="bad">Bad</TabsTrigger>
                <TabsTrigger value="ideas">Ideas</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {board.cards.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No cards yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to add a retrospective card to this board
                </p>
                <Button 
                  onClick={() => setIsAddCardOpen(true)}
                  className="button-glow"
                >
                  Add Your First Card
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterCards(board.cards, activeCategory).map((card) => (
                  <RetroCard 
                    key={card.id} 
                    card={card} 
                    onVote={() => handleVote(card.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Board not found</h3>
            <Button 
              className="mt-4"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SprintDetail;
