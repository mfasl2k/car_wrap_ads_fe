import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { advertiserService } from "../../services/advertiserService";
import type { Application, ApplicationStatistics } from "../../types";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorHandler";

interface CampaignApplicationsResponse {
  data: Application[];
  statistics: ApplicationStatistics;
}

const CampaignApplications = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statistics, setStatistics] = useState<ApplicationStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<{
    driverId: string;
    name: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchApplications = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      const response = await advertiserService.getCampaignApplications(
        campaignId,
        statusFilter || undefined
      );

      if (response.status === "success" && response.data) {
        const data = response.data as CampaignApplicationsResponse;
        setApplications(data.data || []);
        setStatistics((s) => data.statistics || s);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error(getErrorMessage(error, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  }, [campaignId, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (driverId: string, driverName: string) => {
    if (!campaignId) return;
    if (
      !confirm(`Are you sure you want to approve ${driverName}'s application?`)
    ) {
      return;
    }

    try {
      setProcessingId(driverId);
      const response = await advertiserService.approveApplication(
        campaignId,
        driverId
      );

      if (response.status === "success") {
        toast.success("Application approved successfully");
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error(getErrorMessage(error, "Failed to approve application"));
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (driverId: string, driverName: string) => {
    setSelectedDriver({ driverId, name: driverName });
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!campaignId || !selectedDriver) return;

    if (rejectionReason.length > 0 && rejectionReason.length < 10) {
      toast.error("Rejection reason must be at least 10 characters");
      return;
    }

    try {
      setProcessingId(selectedDriver.driverId);
      const response = await advertiserService.rejectApplication(
        campaignId,
        selectedDriver.driverId,
        rejectionReason || undefined
      );

      if (response.status === "success") {
        toast.success("Application rejected");
        setShowRejectModal(false);
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error(getErrorMessage(error, "Failed to reject application"));
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/advertiser/campaigns")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Campaigns
            </button>
            <div className="text-3xl">📋</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Campaign Applications
              </h1>
              {applications[0]?.campaign && (
                <p className="text-sm text-gray-600">
                  {applications[0].campaign.campaignName}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">
              {statistics.total}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-800">
              {statistics.pending}
            </div>
            <div className="text-sm text-yellow-600">Pending Review</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-800">
              {statistics.approved}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-800">
              {statistics.rejected}
            </div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-wrap border-b">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-6 py-3 font-medium ${
                statusFilter === ""
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-6 py-3 font-medium ${
                statusFilter === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-6 py-3 font-medium ${
                statusFilter === "approved"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-6 py-3 font-medium ${
                statusFilter === "rejected"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter
                ? `No ${statusFilter} applications`
                : "No applications yet"}
            </h3>
            <p className="text-gray-600">
              {statusFilter
                ? `There are no ${statusFilter} applications for this campaign.`
                : "No drivers have applied to this campaign yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.driverCampaignId}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    {/* Driver Info */}
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {application.driver?.firstName}{" "}
                            {application.driver?.lastName}
                          </h3>
                          {application.driver?.user?.email && (
                            <p className="text-sm text-gray-600">
                              {application.driver.user.email}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      {/* Driver Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="font-medium text-gray-900">
                            ⭐{" "}
                            {typeof application.driver?.averageRating ===
                            "string"
                              ? parseFloat(
                                  application.driver.averageRating
                                ).toFixed(1)
                              : (
                                  application.driver?.averageRating || 0
                                ).toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Match Score</p>
                          <p className="font-medium text-blue-600">
                            {typeof application.matchScore === "string"
                              ? parseFloat(application.matchScore).toFixed(0)
                              : application.matchScore?.toFixed(0) || 0}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">
                            📍 {application.driver?.city || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">
                            {application.driver?.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Vehicles */}
                      {application.driver?.vehicles &&
                        application.driver.vehicles.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">
                              Vehicles:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {application.driver.vehicles.map((vehicle) => (
                                <div
                                  key={vehicle.vehicleId}
                                  className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
                                >
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                  {vehicle.isVerified && (
                                    <span className="ml-2 text-green-600">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Application Dates */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                        <div>
                          <span className="font-medium">Applied:</span>{" "}
                          {formatDate(application.appliedAt)}
                        </div>
                        {application.approvedAt && (
                          <div>
                            <span className="font-medium">Approved:</span>{" "}
                            {formatDate(application.approvedAt)}
                          </div>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {application.status === "rejected" &&
                        application.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                            <p className="text-sm font-medium text-red-800 mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {application.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions (only for pending applications) */}
                  {application.status === "pending" && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <button
                        onClick={() =>
                          handleApprove(
                            application.driverId,
                            `${application.driver?.firstName} ${application.driver?.lastName}`
                          )
                        }
                        disabled={processingId === application.driverId}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === application.driverId ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Approving...
                          </span>
                        ) : (
                          "✓ Approve"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          openRejectModal(
                            application.driverId,
                            `${application.driver?.firstName} ${application.driver?.lastName}`
                          )
                        }
                        disabled={processingId === application.driverId}
                        className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {selectedDriver.name}'s
              application?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection (minimum 10 characters if provided)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                  <span className="text-red-600">
                    Minimum 10 characters required
                  </span>
                )}
                {rejectionReason.length >= 10 && (
                  <span className="text-green-600">✓ Valid reason</span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={
                  processingId !== null ||
                  (rejectionReason.length > 0 && rejectionReason.length < 10)
                }
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId ? "Rejecting..." : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignApplications;
