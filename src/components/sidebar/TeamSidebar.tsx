
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Team {
  id: string;
  name: string;
}

// Mock teams data
const teams: Team[] = [
  { id: "team-1", name: "Frontend" },
  { id: "team-2", name: "Backend" },
  { id: "team-3", name: "Design" },
  { id: "team-4", name: "DevOps" },
  { id: "team-5", name: "QA" },
];

const TeamSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full p-4 flex flex-col animate-fade-in">
      <div className="px-2 py-2">
        <h2 className="text-lg font-semibold mb-2">Teams</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select a team to view their retrospectives
        </p>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start text-left ${!location.search.includes('team=') ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            All Teams
          </Button>
          {teams.map((team) => (
            <Button
              key={team.id}
              variant="ghost"
              className={`w-full justify-start text-left ${location.search.includes(`team=${team.name}`) ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => navigate(`/dashboard?team=${team.name}`)}
            >
              {team.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-2 py-2">
        <h2 className="text-lg font-semibold mb-2">Recent Sprints</h2>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => navigate('/board/board-1')}
          >
            Sprint 42 Retrospective
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => navigate('/board/board-2')}
          >
            Sprint 43 Retrospective
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamSidebar;
