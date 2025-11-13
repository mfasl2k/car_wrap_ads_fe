import api from "./api";
import type { ApiResponse } from "../types";

export const adminService = {
  // Get all vehicles (admin only)
  getAllVehicles: async () => {
    const response = await api.get<ApiResponse>("/vehicles/all");
    return response.data;
  },

  // Verify a vehicle (admin only)
  verifyVehicle: async (vehicleId: string) => {
    const response = await api.patch<ApiResponse>(
      `/vehicles/${vehicleId}/verify`
    );
    return response.data;
  },

  // Get all drivers (admin only)
  getAllDrivers: async () => {
    const response = await api.get<ApiResponse>("/drivers");
    return response.data;
  },

  // Get all advertisers (admin only)
  getAllAdvertisers: async () => {
    const response = await api.get<ApiResponse>("/advertisers");
    return response.data;
  },

  // Get all campaigns (admin only)
  getAllCampaigns: async () => {
    const response = await api.get<ApiResponse>("/campaigns");
    return response.data;
  },

  // Get driver details by ID (admin only)
  getDriverById: async (driverId: string) => {
    const response = await api.get<ApiResponse>(`/drivers/${driverId}`);
    return response.data;
  },

  // Verify vehicle (admin only) - vehicle verification is part of driver details
  verifyDriverVehicle: async (vehicleId: string) => {
    const response = await api.patch<ApiResponse>(
      `/vehicles/${vehicleId}/verify`
    );
    return response.data;
  },

  // Verify driver (admin only)
  verifyDriver: async (driverId: string) => {
    const response = await api.patch<ApiResponse>(
      `/drivers/${driverId}/verify`
    );
    return response.data;
  },

  // Verify advertiser (admin only)
  verifyAdvertiser: async (advertiserId: string) => {
    const response = await api.patch<ApiResponse>(
      `/advertisers/${advertiserId}/verify`
    );
    return response.data;
  },
};
