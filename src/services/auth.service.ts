
// This would normally interact with a backend API
// For this demo, we're using local storage

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  team: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  team: string;
  password: string;
}

export const authService = {
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('retroUser');
    return userData ? JSON.parse(userData) : null;
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('retroToken');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('retroToken');
  }
};
