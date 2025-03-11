
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { boardService } from "@/services/board.service";
import { toast } from "sonner";

interface CreateBoardButtonProps {
  onBoardCreated?: () => void;
}

const CreateBoardButton: React.FC<CreateBoardButtonProps> = ({ onBoardCreated }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    team: "",
    description: ""
  });

  if (!user?.isAdmin) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newBoard = await boardService.createBoard({
        ...formData,
        createdBy: user.id
      });
      
      toast.success("Sprint board created successfully!");
      setIsOpen(false);
      
      // Reset form data
      setFormData({
        name: "",
        date: new Date().toISOString().split("T")[0],
        team: "",
        description: ""
      });
      
      // Call the callback if provided
      if (onBoardCreated) {
        onBoardCreated();
      }
      
      // Navigate to the new board
      navigate(`/board/${newBoard.id}`);
    } catch (error) {
      toast.error("Failed to create sprint board");
      console.error("Create board error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="button-glow">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Sprint Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg glass-card">
        <DialogHeader>
          <DialogTitle>Create New Sprint Board</DialogTitle>
          <DialogDescription>
            Set up a new retrospective board for your team's sprint.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Sprint 44 Retrospective"
              value={formData.name}
              onChange={handleChange}
              required
              className="backdrop-blur-sm bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Sprint Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="backdrop-blur-sm bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              name="team"
              placeholder="Frontend"
              value={formData.team}
              onChange={handleChange}
              required
              className="backdrop-blur-sm bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Retro for our latest sprint achievements and challenges"
              value={formData.description}
              onChange={handleChange}
              className="resize-none h-20 backdrop-blur-sm bg-white/50"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardButton;
