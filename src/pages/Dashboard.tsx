
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import TeamSidebar from "@/components/sidebar/TeamSidebar";
import SprintBoard from "@/components/board/SprintBoard";
import CreateBoardButton from "@/components/board/CreateBoardButton";
import AdminRegisterForm from "@/components/auth/AdminRegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { boardService, SprintBoard as SprintBoardType } from "@/services/board.service";
import { toast } from "sonner";

const Dashboard = () => {
  const [boards, setBoards] = useState<SprintBoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("boards");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the team filter from URL query params
  const queryParams = new URLSearchParams(location.search);
  const teamFilter = queryParams.get("team");
  const tabParam = queryParams.get("tab");
  
  useEffect(() => {
    if (tabParam === "users" && user?.isAdmin) {
      setActiveTab("users");
    } else {
      setActiveTab("boards");
    }
  }, [tabParam, user]);
  
  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try {
        const data = await boardService.getBoards();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
        toast.error("Failed to load sprint boards");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBoards();
  }, []);
  
  // Filter boards by team if a team filter is applied
  const filteredBoards = teamFilter 
    ? boards.filter(board => board.team === teamFilter)
    : boards;
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(tab === "users" ? "/dashboard?tab=users" : "/dashboard");
  };

  return (
    <AppLayout sidebar={<TeamSidebar />}>
      <div className="animate-fade-in">
        {user?.isAdmin ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="boards">Sprint Boards</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
              </TabsList>
              
              {activeTab === "boards" && (
                <CreateBoardButton 
                  onBoardCreated={() => {
                    // We'll re-fetch boards when navigating back to dashboard
                  }} 
                />
              )}
            </div>
            
            <TabsContent value="boards" className="mt-0">
              <BoardsView 
                boards={filteredBoards} 
                isLoading={isLoading} 
                teamFilter={teamFilter}
              />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">User Management</h2>
                  <p className="text-muted-foreground mb-6">Create accounts for your team members</p>
                </div>
                <AdminRegisterForm />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Sprint Boards</h2>
            <p className="text-muted-foreground mb-6">
              {teamFilter ? `${teamFilter} team retrospectives` : "All team retrospectives"}
            </p>
            <BoardsView 
              boards={filteredBoards} 
              isLoading={isLoading} 
              teamFilter={teamFilter}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

interface BoardsViewProps {
  boards: SprintBoardType[];
  isLoading: boolean;
  teamFilter: string | null;
}

const BoardsView: React.FC<BoardsViewProps> = ({ boards, isLoading, teamFilter }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No sprint boards found</h3>
        <p className="text-muted-foreground">
          {teamFilter
            ? `There are no retrospectives for the ${teamFilter} team yet.`
            : "No retrospectives have been created yet."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <SprintBoard key={board.id} board={board} />
      ))}
    </div>
  );
};

export default Dashboard;
