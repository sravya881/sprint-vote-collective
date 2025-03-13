
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  team: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registerUser: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
};

type RegisterUserData = {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  team: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to your backend
        // which would return the current Windows authenticated user
        
        // Simulate Windows Authentication for demo
        // In production, this would be replaced with a real API call
        // that returns the authenticated Windows user from your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authenticated user based on Windows credentials
        const windowsUser: User = {
          id: "user-windows-1",
          name: "Windows User",
          email: "windows.user@company.com",
          employeeId: "EMP001",
          department: "Engineering",
          team: "Frontend",
          isAdmin: true
        };
        
        setUser(windowsUser);
        toast.success("Windows Authentication successful");
      } catch (error) {
        console.error("Windows Authentication failed:", error);
        toast.error("Authentication failed. Please contact your administrator.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const registerUser = async (userData: RegisterUserData) => {
    setIsLoading(true);
    try {
      // Check if current user is admin
      if (!user || !user.isAdmin) {
        throw new Error("Only admins can register new users");
      }

      // In a real app, this would be an API call to register the user
      // Mock user registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        employeeId: userData.employeeId,
        department: userData.department,
        team: userData.team,
        isAdmin: false
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Registered new user:", newUser);
      
      toast.success("User registered successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a Windows Authentication setup, this would typically redirect to a logout endpoint
    // For our demo, we'll just clear the user state
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
