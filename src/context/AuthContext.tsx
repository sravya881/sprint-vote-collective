
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (userData: RegisterUserData) => Promise<void>;
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
    // Check if user is already logged in
    const storedUser = localStorage.getItem("retroUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("retroUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Mock login with hardcoded users for demo
      const adminUser: User = {
        id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        employeeId: "ADMIN001",
        department: "Management",
        team: "Leadership",
        isAdmin: true
      };
      
      const regularUser: User = {
        id: "user-1",
        name: "Regular User",
        email: "user@example.com",
        employeeId: "EMP001",
        department: "Engineering",
        team: "Frontend",
        isAdmin: false
      };

      // Basic validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Mock authentication logic
      let authenticatedUser = null;
      if (email === "admin@example.com" && password === "admin123") {
        authenticatedUser = adminUser;
      } else if (email === "user@example.com" && password === "user123") {
        authenticatedUser = regularUser;
      } else {
        throw new Error("Invalid credentials");
      }

      if (!authenticatedUser) {
        throw new Error("Authentication failed");
      }

      // Store user in local storage
      localStorage.setItem("retroUser", JSON.stringify(authenticatedUser));
      localStorage.setItem("retroToken", "mock-jwt-token-" + authenticatedUser.id);
      
      setUser(authenticatedUser);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("retroUser");
    localStorage.removeItem("retroToken");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const registerUser = async (userData: RegisterUserData) => {
    setIsLoading(true);
    try {
      // Check if current user is admin
      if (!user || !user.isAdmin) {
        throw new Error("Only admins can register new users");
      }

      // In a real app, this would be an API call
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
      
      // In a real app, the new user would be stored in the database
      console.log("Registered new user:", newUser);
      
      toast.success("User registered successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        registerUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
