import apiClient from "./api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  User,
} from "../types";

export const authService = {
  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    userId: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
