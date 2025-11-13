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

  // Upload vehicle photo
  uploadVehiclePhoto: async (
    vehicleId: string,
    photoFile: File
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await apiClient.post(
      `/vehicles/${vehicleId}/upload-photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get all active campaigns (for drivers to browse)
  getAvailableCampaigns: async (): Promise<ApiResponse> => {
    const response = await apiClient.get("/campaigns");
    return response.data;
  },

  // Apply to a campaign
  applyCampaign: async (campaignId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/campaigns/${campaignId}/apply`);
    return response.data;
  },

  // Get driver's applications with optional status filter
  getMyApplications: async (status?: string): Promise<ApiResponse> => {
    const params = status ? { status } : {};
    const response = await apiClient.get("/campaigns/applications/my", {
      params,
    });
    return response.data;
  },

  // Cancel application (only pending applications can be cancelled)
  cancelApplication: async (campaignId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/campaigns/${campaignId}/apply`);
    return response.data;
  },
};
