import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { driverService } from "../../services/driverService";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";

interface Campaign {
  campaignId: string;
  campaignName: string;
  description?: string;
  startDate: string | Date;
  endDate: string | Date;
  paymentPerDay: number;
  requiredDrivers: number;
  status: string;
  wrapDesignUrl?: string;
  advertiser?: {
    advertiserId: string;
    companyName: string;
  };
  _count?: {
    applications: number;
  };
}

export default function BrowseCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await driverService.getAvailableCampaigns();

      if (response.status === "success" && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const campaignsData = (response.data as any).campaigns || response.data;
        // Filter only active campaigns
        const activeCampaigns = Array.isArray(campaignsData)
          ? campaignsData.filter((c: Campaign) => c.status === "active")
          : [];
        setCampaigns(activeCampaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error(getErrorMessage(error, "Failed to load campaigns"));
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (campaignId: string) => {
    try {
      setApplying(campaignId);
      const response = await driverService.applyCampaign(campaignId);

      if (response.status === "success") {
        toast.success("Application submitted successfully!");
        await fetchCampaigns();
      }
    } catch (error) {
      console.error("Error applying to campaign:", error);
      toast.error(getErrorMessage(error, "Failed to submit application"));
    } finally {
      setApplying(null);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      campaign.campaignName?.toLowerCase().includes(searchLower) ||
      campaign.description?.toLowerCase().includes(searchLower) ||
      campaign.advertiser?.companyName?.toLowerCase().includes(searchLower)
    );
  });

  const calculateDuration = (
    startDate: string | Date,
    endDate: string | Date
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate("/driver/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold">Browse Campaigns</h1>
          </div>
          <p className="text-gray-600">Find and apply to active campaigns</p>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full sm:w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Active Campaigns
          </h3>
          <p className="text-3xl font-bold text-primary-600">
            {campaigns.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Positions
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {campaigns.reduce((sum, c) => sum + (c.requiredDrivers || 0), 0)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Avg. Payment/Day
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            $
            {campaigns.length > 0
              ? (
                  campaigns.reduce((sum, c) => {
                    const payment =
                      typeof c.paymentPerDay === "string"
                        ? parseFloat(c.paymentPerDay)
                        : c.paymentPerDay || 0;
                    return sum + payment;
                  }, 0) / campaigns.length
                ).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold mb-2">
            {searchTerm ? "No campaigns found" : "No active campaigns"}
          </h2>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Check back later for new opportunities"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => {
            const duration = calculateDuration(
              campaign.startDate,
              campaign.endDate
            );
            const payment =
              typeof campaign.paymentPerDay === "string"
                ? parseFloat(campaign.paymentPerDay)
                : campaign.paymentPerDay;
            const totalEarnings = (payment * duration).toFixed(2);
            const spotsLeft =
              campaign.requiredDrivers - (campaign._count?.applications || 0);

            return (
              <div
                key={campaign.campaignId}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Campaign Image */}
                  <div className="md:w-80 h-48 md:h-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                    {campaign.wrapDesignUrl ? (
                      <img
                        src={campaign.wrapDesignUrl}
                        alt={campaign.campaignName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="text-6xl mb-2">🎨</div>
                        <p className="text-sm text-gray-600 font-medium">
                          Campaign Design
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Campaign Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      {/* Campaign Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                            ACTIVE
                          </div>
                          {spotsLeft > 0 && spotsLeft <= 3 && (
                            <div className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded animate-pulse">
                              🔥 Only {spotsLeft} spots left!
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {campaign.campaignName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                          <span className="font-medium">🏢</span>
                          {campaign.advertiser?.companyName ||
                            "Unknown Advertiser"}
                        </p>
                        {campaign.description && (
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {campaign.description}
                          </p>
                        )}
                      </div>

                      {/* Apply Button - Desktop */}
                      <div className="hidden md:block md:min-w-[160px]">
                        <button
                          onClick={() => handleApply(campaign.campaignId)}
                          disabled={
                            applying === campaign.campaignId || spotsLeft <= 0
                          }
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                        >
                          {applying === campaign.campaignId
                            ? "Applying..."
                            : spotsLeft <= 0
                            ? "Fully Booked"
                            : "Apply Now"}
                        </button>
                      </div>
                    </div>

                    {/* Campaign Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg">⏱️</span>
                          <span className="text-xs text-gray-600 font-medium">
                            Duration
                          </span>
                        </div>
                        <p className="font-bold text-gray-900">
                          {duration} days
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg">💵</span>
                          <span className="text-xs text-gray-600 font-medium">
                            Payment/Day
                          </span>
                        </div>
                        <p className="font-bold text-green-600">
                          ${payment.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg">💰</span>
                          <span className="text-xs text-gray-600 font-medium">
                            Total Earnings
                          </span>
                        </div>
                        <p className="font-bold text-blue-600">
                          ${totalEarnings}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg">👥</span>
                          <span className="text-xs text-gray-600 font-medium">
                            Spots Available
                          </span>
                        </div>
                        <p
                          className={`font-bold ${
                            spotsLeft <= 3 ? "text-orange-600" : "text-gray-900"
                          }`}
                        >
                          {spotsLeft > 0 ? spotsLeft : 0} /{" "}
                          {campaign.requiredDrivers}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">📅 Start:</span>
                        <span>
                          {new Date(campaign.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">🏁 End:</span>
                        <span>
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Apply Button - Mobile */}
                    <div className="md:hidden mt-4">
                      <button
                        onClick={() => handleApply(campaign.campaignId)}
                        disabled={
                          applying === campaign.campaignId || spotsLeft <= 0
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
                      >
                        {applying === campaign.campaignId
                          ? "Applying..."
                          : spotsLeft <= 0
                          ? "Fully Booked"
                          : "Apply Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
