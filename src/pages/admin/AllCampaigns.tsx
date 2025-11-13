import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
import type { Campaign } from "../../types";

interface CampaignWithDetails extends Campaign {
  advertiser?: {
    advertiserId: string;
    companyName: string;
  };
  _count?: {
    driverCampaigns: number;
  };
}

export default function AllCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCampaigns();

      if (response.status === "success" && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const campaignsData = (response.data as any).campaigns || response.data;
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter !== "all" && campaign.status !== filter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        campaign.campaignName?.toLowerCase().includes(searchLower) ||
        campaign.advertiser?.companyName?.toLowerCase().includes(searchLower) ||
        campaign.description?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">All Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all advertising campaigns
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by campaign name, company, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All ({campaigns.length})
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "draft"
              ? "bg-gray-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Draft ({campaigns.filter((c) => c.status === "draft").length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active ({campaigns.filter((c) => c.status === "active").length})
        </button>
        <button
          onClick={() => setFilter("paused")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "paused"
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Paused ({campaigns.filter((c) => c.status === "paused").length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed ({campaigns.filter((c) => c.status === "completed").length})
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "cancelled"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Cancelled ({campaigns.filter((c) => c.status === "cancelled").length})
        </button>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📢</div>
          <h2 className="text-xl font-semibold mb-2">
            {searchTerm ? "No campaigns found" : "No campaigns yet"}
          </h2>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No campaigns have been created yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.campaignId} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">
                      {campaign.campaignName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {campaign.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">By:</span>
                    <span>{campaign.advertiser?.companyName || "Unknown"}</span>
                  </div>
                </div>
              </div>

              {/* Campaign Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                <div>
                  <span className="text-sm text-gray-600">Duration:</span>
                  <p className="font-medium">
                    {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment/Day:</span>
                  <p className="font-medium text-green-600">
                    ${Number(campaign.paymentPerDay).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Required Drivers:
                  </span>
                  <p className="font-medium">{campaign.requiredDrivers}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Applications:</span>
                  <p className="font-medium">
                    {campaign._count?.driverCampaigns || 0}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
