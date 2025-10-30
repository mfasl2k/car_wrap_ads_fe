import apiClient from './api';
import type { Advertiser, ApiResponse, Campaign } from '../types';

export const advertiserService = {
  // Get advertiser profile
  getAdvertiserProfile: async (advertiserId: string): Promise<ApiResponse<Advertiser>> => {
    const response = await apiClient.get(`/advertisers/${advertiserId}`);
    return response.data;
  },

  // Update advertiser profile
  updateAdvertiserProfile: async (advertiserId: string, data: Partial<Advertiser>): Promise<ApiResponse<Advertiser>> => {
    const response = await apiClient.put(`/advertisers/${advertiserId}`, data);
    return response.data;
  },

  // Get advertiser campaigns
  getAdvertiserCampaigns: async (advertiserId: string): Promise<ApiResponse<Campaign[]>> => {
    const response = await apiClient.get(`/advertisers/${advertiserId}/campaigns`);
    return response.data;
  },

  // Create campaign
  createCampaign: async (campaignData: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.post('/campaigns', campaignData);
    return response.data;
  },

  // Update campaign
  updateCampaign: async (campaignId: string, campaignData: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    const response = await apiClient.put(`/campaigns/${campaignId}`, campaignData);
    return response.data;
  },

  // Delete campaign
  deleteCampaign: async (campaignId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/campaigns/${campaignId}`);
    return response.data;
  },
};
