import apiClient from "./api";
import type { Driver, ApiResponse, Vehicle } from "../types";

export const driverService = {
  // Get driver profile
  getDriverProfile: async (driverId: string): Promise<ApiResponse<Driver>> => {
    const response = await apiClient.get(`/drivers/${driverId}`);
    return response.data;
  },

  // Update driver profile
  updateDriverProfile: async (
    driverId: string,
    data: Partial<Driver>
  ): Promise<ApiResponse<Driver>> => {
    const response = await apiClient.put(`/drivers/${driverId}`, data);
    return response.data;
  },

  // Get driver vehicles
  getDriverVehicles: async (
    driverId: string
  ): Promise<ApiResponse<Vehicle[]>> => {
    const response = await apiClient.get(`/drivers/${driverId}/vehicles`);
    return response.data;
  },

  // Add vehicle
  addVehicle: async (
    driverId: string,
    vehicleData: Partial<Vehicle>
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await apiClient.post(
      `/drivers/${driverId}/vehicles`,
      vehicleData
    );
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
