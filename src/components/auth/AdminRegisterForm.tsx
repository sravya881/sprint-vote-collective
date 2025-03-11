
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegisterUserData {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  team: string;
  password: string;
  confirmPassword: string;
}

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterUserData>({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    team: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      await registerUser(userData);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        employeeId: "",
        department: "",
        team: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-accent/20 shadow-md w-full">
      <CardHeader>
        <CardTitle className="text-xl">Register New User</CardTitle>
        <CardDescription>Create a new account for a team member</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="backdrop-blur-sm bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="backdrop-blur-sm bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                name="employeeId"
                placeholder="EMP001"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="backdrop-blur-sm bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="Engineering"
                value={formData.department}
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="backdrop-blur-sm bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="backdrop-blur-sm bg-white/50"
              />
            </div>
          </div>
          <Button type="submit" className="w-full button-glow" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminRegisterForm;
