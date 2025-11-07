import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { advertiserService } from "../../services/advertiserService";
import type { Campaign } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export default function ViewCampaigns() {
  const navigate = useNavigate();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await advertiserService.getAdvertiserCampaigns();

      if (response.status === "success" && response.data) {
        // Handle both nested and direct response structure
        const campaignsData = (response.data as any).campaigns || response.data;
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      await advertiserService.updateCampaignStatus(campaignId, newStatus);
      toast.success(`Campaign status updated to ${newStatus}`);
      fetchCampaigns(); // Refresh the list
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error("Failed to update campaign status");
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

  const filteredCampaigns =
    filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/advertiser/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="text-3xl">📊</div>
              <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
            </div>
            <button
              onClick={() => navigate("/advertiser/campaigns/create")}
              className="btn-primary"
            >
              + Create Campaign
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({campaigns.length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "draft"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Draft ({campaigns.filter((c) => c.status === "draft").length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "active"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active ({campaigns.filter((c) => c.status === "active").length})
            </button>
            <button
              onClick={() => setFilter("paused")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "paused"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paused ({campaigns.filter((c) => c.status === "paused").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "completed"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed (
              {campaigns.filter((c) => c.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Campaigns List */}
        {filteredCampaigns.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">
              {filter === "all" ? "No campaigns yet" : `No ${filter} campaigns`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Create your first campaign to start advertising"
                : `You don't have any ${filter} campaigns`}
            </p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/advertiser/campaigns/create")}
                className="btn-primary"
              >
                Create Your First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.campaignId}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">
                        {campaign.campaignName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{campaign.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Start Date</span>
                    <p className="font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">End Date</span>
                    <p className="font-medium">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Payment/Day</span>
                    <p className="font-medium text-green-600">
                      $
                      {campaign.paymentPerDay
                        ? Number(campaign.paymentPerDay).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Drivers Needed
                    </span>
                    <p className="font-medium">{campaign.requiredDrivers}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {campaign.status === "draft" && (
                    <button
                      onClick={() =>
                        handleStatusChange(campaign.campaignId, "active")
                      }
                      className="btn-primary text-sm"
                    >
                      Activate
                    </button>
                  )}
                  {campaign.status === "active" && (
                    <button
                      onClick={() =>
                        handleStatusChange(campaign.campaignId, "paused")
                      }
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      Pause
                    </button>
                  )}
                  {campaign.status === "paused" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(campaign.campaignId, "active")
                        }
                        className="btn-primary text-sm"
                      >
                        Resume
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(campaign.campaignId, "cancelled")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button className="btn-secondary text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
