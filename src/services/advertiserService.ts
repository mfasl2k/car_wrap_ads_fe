import apiClient from "./api";
import type { Advertiser, ApiResponse, Campaign } from "../types";

export const advertiserService = {
  // Get current advertiser profile (authenticated user)
  getAdvertiserProfile: async (): Promise<ApiResponse<Advertiser>> => {
    const response = await apiClient.get("/advertisers/me");
    return response.data;
  },

  // Create advertiser profile
  createAdvertiserProfile: async (
    data: Partial<Advertiser>
  ): Promise<ApiResponse<Advertiser>> => {
    const response = await apiClient.post("/advertisers", data);
    return response.data;
  },

  // Update advertiser profile
  updateAdvertiserProfile: async (
    data: Partial<Advertiser>
  ): Promise<ApiResponse<Advertiser>> => {
    const response = await apiClient.put("/advertisers/me", data);
    return response.data;
  },

  // Get advertiser campaigns
  getAdvertiserCampaigns: async (): Promise<ApiResponse<Campaign[]>> => {
    const response = await apiClient.get("/campaigns/my");
    return response.data;
  },

  // Get single campaign details
  getCampaignById: async (
    campaignId: string
  ): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.get(`/campaigns/${campaignId}`);
    return response.data;
  },

  // Create campaign
  createCampaign: async (
    campaignData: Partial<Campaign>
  ): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.post("/campaigns", campaignData);
    return response.data;
  },

  // Update campaign
  updateCampaign: async (
    campaignId: string,
    campaignData: Partial<Campaign>
  ): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.put(
      `/campaigns/${campaignId}`,
      campaignData
    );
    return response.data;
  },

  // Update campaign status
  updateCampaignStatus: async (
    campaignId: string,
    status: string
  ): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.patch(`/campaigns/${campaignId}/status`, {
      status,
    });
    return response.data;
  },

  // Delete campaign
  deleteCampaign: async (campaignId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/campaigns/${campaignId}`);
    return response.data;
  },

  // Upload campaign wrap design
  uploadCampaignDesign: async (
    campaignId: string,
    designFile: File
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("design", designFile);

    const response = await apiClient.post(
      `/campaigns/${campaignId}/upload-design`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get applications for a specific campaign
  getCampaignApplications: async (
    campaignId: string,
    status?: string
  ): Promise<ApiResponse> => {
    const params = status ? { status } : {};
    const response = await apiClient.get(
      `/campaigns/${campaignId}/applications`,
      { params }
    );
    return response.data;
  },

  // Approve a driver's application
  approveApplication: async (
    campaignId: string,
    driverId: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.patch(
      `/campaigns/${campaignId}/applications/${driverId}/approve`
    );
    return response.data;
  },

  // Reject a driver's application
  rejectApplication: async (
    campaignId: string,
    driverId: string,
    reason?: string
  ): Promise<ApiResponse> => {
    const response = await apiClient.patch(
      `/campaigns/${campaignId}/applications/${driverId}/reject`,
      reason ? { reason } : {}
    );
    return response.data;
  },
};
