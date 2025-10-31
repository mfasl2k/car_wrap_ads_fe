import apiClient from "./api";
import type { Driver, ApiResponse, Vehicle } from "../types";

export const driverService = {
  // Get current driver profile (authenticated user)
  getDriverProfile: async (): Promise<ApiResponse<Driver>> => {
    const response = await apiClient.get("/drivers/me");
    return response.data;
  },

  // Create driver profile
  createDriverProfile: async (
    data: Partial<Driver>
  ): Promise<ApiResponse<Driver>> => {
    const response = await apiClient.post("/drivers", data);
    return response.data;
  },

  // Update driver profile
  updateDriverProfile: async (
    data: Partial<Driver>
  ): Promise<ApiResponse<Driver>> => {
    const response = await apiClient.put("/drivers/me", data);
    return response.data;
  },

  // Get driver vehicles
  getDriverVehicles: async (): Promise<ApiResponse<Vehicle[]>> => {
    const response = await apiClient.get("/vehicles/my");
    return response.data;
  },

  // Add vehicle
  addVehicle: async (
    vehicleData: Partial<Vehicle>
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await apiClient.post("/vehicles", vehicleData);
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (
    vehicleId: string,
    vehicleData: Partial<Vehicle>
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await apiClient.put(`/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/vehicles/${vehicleId}`);
    return response.data;
  },
};
