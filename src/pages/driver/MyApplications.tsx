import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { driverService } from "../../services/driverService";
import type { Application, ApplicationStatistics } from "../../types";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statistics, setStatistics] = useState<ApplicationStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await driverService.getMyApplications(
        statusFilter || undefined
      );

      // API returns: { success: true, data: [...] }
      // Each application has statistics property
      const responseData = response as any;
      if (responseData.success && responseData.data) {
        const applicationsData = Array.isArray(responseData.data)
          ? responseData.data
          : [];

        // Get statistics from the first application if available
        const statsData =
          applicationsData.length > 0 && applicationsData[0].statistics
            ? applicationsData[0].statistics
            : {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                active: 0,
                completed: 0,
              };

        setApplications(applicationsData);
        setStatistics(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error(getErrorMessage(error, "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCancelApplication = async (campaignId: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) {
      return;
    }

    try {
      setCancellingId(campaignId);
      const response = await driverService.cancelApplication(campaignId);

      const responseData = response as any;
      if (responseData.success || response.status === "success") {
        toast.success("Application cancelled successfully");
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to cancel application:", error);
      toast.error(getErrorMessage(error, "Failed to cancel application"));
    } finally {
      setCancellingId(null);
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

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"}`;
    }
  };

  const calculateEarnings = (
    paymentPerDay: string | number,
    startDate: string,
    endDate: string
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const payment =
      typeof paymentPerDay === "string"
        ? parseFloat(paymentPerDay)
        : paymentPerDay;
    return (payment * diffDays).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/driver/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Applications
        </h1>
        <p className="text-gray-600">Track all your campaign applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">
            {statistics.total}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-800">
            {statistics.pending}
          </div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-800">
            {statistics.approved}
          </div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-800">
            {statistics.active || 0}
          </div>
          <div className="text-sm text-blue-600">Active</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">
            {statistics.completed || 0}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
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
            onClick={() => setStatusFilter("active")}
            className={`px-6 py-3 font-medium ${
              statusFilter === "active"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-6 py-3 font-medium ${
              statusFilter === "completed"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed
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
          <p className="text-gray-600 mb-6">
            {statusFilter
              ? `You don't have any ${statusFilter} applications at the moment.`
              : "Start by browsing available campaigns and submitting your applications."}
          </p>
          <button
            onClick={() => navigate("/driver/campaigns")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Campaigns
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.driverCampaignId}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.campaign.campaignName}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {application.campaign.advertiser.companyName}
                    </p>
                    {application.campaign.description && (
                      <p className="text-gray-700 mb-3">
                        {application.campaign.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Campaign Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">
                      {calculateDuration(
                        application.campaign.startDate,
                        application.campaign.endDate
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment/Day</p>
                    <p className="font-medium text-gray-900">
                      $
                      {typeof application.campaign.paymentPerDay === "string"
                        ? parseFloat(
                            application.campaign.paymentPerDay
                          ).toFixed(2)
                        : application.campaign.paymentPerDay.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="font-medium text-green-600">
                      $
                      {calculateEarnings(
                        application.campaign.paymentPerDay,
                        application.campaign.startDate,
                        application.campaign.endDate
                      )}
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
                </div>

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Campaign Period:</span>{" "}
                    {formatDate(application.campaign.startDate)} -{" "}
                    {formatDate(application.campaign.endDate)}
                  </div>
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
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {application.status === "pending" && (
                    <button
                      onClick={() =>
                        handleCancelApplication(application.campaignId)
                      }
                      disabled={cancellingId === application.campaignId}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === application.campaignId ? (
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
                          Cancelling...
                        </span>
                      ) : (
                        "Cancel Application"
                      )}
                    </button>
                  )}

                  {(application.status === "approved" ||
                    application.status === "active") && (
                    <button
                      onClick={() =>
                        navigate(`/driver/campaigns/${application.campaignId}`)
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Campaign Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
