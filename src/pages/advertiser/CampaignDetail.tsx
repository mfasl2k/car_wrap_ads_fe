import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { advertiserService } from "../../services/advertiserService";
import type { Campaign } from "../../types";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorHandler";

interface CampaignDetailResponse {
  campaign: Campaign;
  applicationsCount?: number;
  approvedDriversCount?: number;
}

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCampaignDetail = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      const response = await advertiserService.getCampaignById(campaignId);

      if (response.status === "success" && response.data) {
        const data = response.data as unknown as CampaignDetailResponse;
        setCampaign(data.campaign || (response.data as Campaign));
      }
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
      toast.error(getErrorMessage(error, "Failed to load campaign details"));
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaignDetail();
  }, [fetchCampaignDetail]);

  const handleStatusChange = async (newStatus: string) => {
    if (!campaignId) return;

    const confirmMessage = `Are you sure you want to change campaign status to "${newStatus}"?`;
    if (!confirm(confirmMessage)) return;

    try {
      setUpdating(true);
      await advertiserService.updateCampaignStatus(campaignId, newStatus);
      toast.success(`Campaign status updated to ${newStatus}`);
      fetchCampaignDetail();
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error(getErrorMessage(error, "Failed to update campaign status"));
    } finally {
      setUpdating(false);
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

  const getStatusBadge = (status: string) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const calculateDuration = (
    startDate: Date | string,
    endDate: Date | string
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return remainingDays > 0
        ? `${months} ${months === 1 ? "month" : "months"} ${remainingDays} days`
        : `${months} ${months === 1 ? "month" : "months"}`;
    }
  };

  const calculateTotalCost = (
    paymentPerDay: number | undefined,
    startDate: Date | string,
    endDate: Date | string,
    requiredDrivers: number
  ) => {
    if (!paymentPerDay) return "0.00";

    const payment =
      typeof paymentPerDay === "string"
        ? parseFloat(paymentPerDay)
        : paymentPerDay;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (payment * diffDays * requiredDrivers).toFixed(2);
  };

  const formatPayment = (payment: number | undefined) => {
    if (!payment) return "0.00";
    const amount = typeof payment === "string" ? parseFloat(payment) : payment;
    return amount.toFixed(2);
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Campaign Not Found
          </h2>
          <button
            onClick={() => navigate("/advertiser/campaigns")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/advertiser/campaigns")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="text-3xl">📊</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {campaign.campaignName}
                </h1>
                <p className="text-sm text-gray-600">Campaign Details</p>
              </div>
            </div>
            {getStatusBadge(campaign.status)}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Duration</div>
            <div className="text-2xl font-bold text-gray-900">
              {calculateDuration(campaign.startDate, campaign.endDate)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow">
            <div className="text-sm text-green-600 mb-1">Payment per Day</div>
            <div className="text-2xl font-bold text-green-700">
              ${formatPayment(campaign.paymentPerDay)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Per driver per day
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <div className="text-sm text-blue-600 mb-1">Required Drivers</div>
            <div className="text-2xl font-bold text-blue-700">
              {campaign.requiredDrivers}
            </div>
            <div className="text-xs text-blue-600 mt-1">Total positions</div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg shadow">
            <div className="text-sm text-purple-600 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-purple-700">
              $
              {calculateTotalCost(
                campaign.paymentPerDay,
                campaign.startDate,
                campaign.endDate,
                campaign.requiredDrivers
              )}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Estimated total cost
            </div>
          </div>
        </div>

        {/* Campaign Information */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaign Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Campaign Name
              </label>
              <p className="text-lg text-gray-900">{campaign.campaignName}</p>
            </div>

            {campaign.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p className="text-gray-900">{campaign.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Start Date
                </label>
                <p className="text-gray-900">
                  {formatDate(campaign.startDate)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  End Date
                </label>
                <p className="text-gray-900">{formatDate(campaign.endDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Payment per Day
                </label>
                <p className="text-gray-900">
                  ${formatPayment(campaign.paymentPerDay)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Required Drivers
                </label>
                <p className="text-gray-900">{campaign.requiredDrivers}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(campaign.status)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created
                </label>
                <p className="text-gray-900">
                  {formatDate(campaign.createdAt)}
                </p>
              </div>
            </div>

            {campaign.wrapDesignUrl && (
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Wrap Design
                </label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={campaign.wrapDesignUrl}
                    alt="Campaign wrap design"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Management */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaign Management
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Change Campaign Status
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Update the status of your campaign based on its current state.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {campaign.status === "draft" && (
                <button
                  onClick={() => handleStatusChange("active")}
                  disabled={updating}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Activate Campaign"}
                </button>
              )}

              {campaign.status === "active" && (
                <>
                  <button
                    onClick={() => handleStatusChange("paused")}
                    disabled={updating}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Pause Campaign"}
                  </button>
                  <button
                    onClick={() => handleStatusChange("completed")}
                    disabled={updating}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Mark as Completed"}
                  </button>
                </>
              )}

              {campaign.status === "paused" && (
                <>
                  <button
                    onClick={() => handleStatusChange("active")}
                    disabled={updating}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Resume Campaign"}
                  </button>
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={updating}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? "Updating..." : "Cancel Campaign"}
                  </button>
                </>
              )}

              {(campaign.status === "completed" ||
                campaign.status === "cancelled") && (
                <div className="text-sm text-gray-600">
                  This campaign has been {campaign.status}. No further status
                  changes are available.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() =>
                  navigate(`/advertiser/campaigns/${campaignId}/applications`)
                }
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-semibold">View Applications</div>
                <div className="text-sm text-gray-600">
                  Manage driver applications
                </div>
              </button>

              <button
                onClick={() =>
                  navigate(`/advertiser/campaigns/${campaignId}/edit`)
                }
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                disabled={
                  campaign.status === "completed" ||
                  campaign.status === "cancelled"
                }
              >
                <div className="text-2xl mb-2">✏️</div>
                <div className="font-semibold">Edit Campaign</div>
                <div className="text-sm text-gray-600">
                  Update campaign details
                </div>
              </button>

              <button
                onClick={() => navigate("/advertiser/campaigns")}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">All Campaigns</div>
                <div className="text-sm text-gray-600">
                  View all your campaigns
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetail;
