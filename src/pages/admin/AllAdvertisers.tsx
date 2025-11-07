import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import type { Advertiser } from "../../types";

interface AdvertiserWithDetails extends Advertiser {
  user?: {
    userId: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
  _count?: {
    campaigns: number;
  };
}

export default function AllAdvertisers() {
  const navigate = useNavigate();
  const toast = useToast();
  const [advertisers, setAdvertisers] = useState<AdvertiserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const fetchAdvertisers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAdvertisers();

      if (response.status === "success" && response.data) {
        const advertisersData =
          (response.data as any).advertisers || response.data;
        setAdvertisers(Array.isArray(advertisersData) ? advertisersData : []);
      }
    } catch (error) {
      console.error("Error fetching advertisers:", error);
      toast.error("Failed to load advertisers");
      setAdvertisers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdvertisers = advertisers.filter((advertiser) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      advertiser.companyName?.toLowerCase().includes(searchLower) ||
      advertiser.contactPerson?.toLowerCase().includes(searchLower) ||
      advertiser.user?.email?.toLowerCase().includes(searchLower) ||
      advertiser.industry?.toLowerCase().includes(searchLower) ||
      advertiser.city?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading advertisers...</div>
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
          <h1 className="text-3xl font-bold">All Advertisers</h1>
          <p className="text-gray-600 mt-1">
            View and manage advertiser accounts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by company name, contact person, email, or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-purple-50 border-purple-200">
          <div className="text-sm text-purple-600 font-medium">
            Total Advertisers
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {advertisers.length}
          </div>
        </div>
        <div className="card bg-green-50 border-green-200">
          <div className="text-sm text-green-600 font-medium">Verified</div>
          <div className="text-3xl font-bold text-green-900">
            {advertisers.filter((a) => a.isVerified).length}
          </div>
        </div>
        <div className="card bg-orange-50 border-orange-200">
          <div className="text-sm text-orange-600 font-medium">
            Total Campaigns
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {advertisers.reduce(
              (sum, a) => sum + (a._count?.campaigns || 0),
              0
            )}
          </div>
        </div>
      </div>

      {/* Advertisers List */}
      {filteredAdvertisers.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold mb-2">
            {searchTerm ? "No advertisers found" : "No advertisers registered"}
          </h2>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No advertisers have registered yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAdvertisers.map((advertiser) => (
            <div key={advertiser.advertiserId} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Company Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">🏢</div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {advertiser.companyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {advertiser.user?.email || "No email"}
                      </p>
                    </div>
                    {advertiser.isVerified && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Company Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">
                        Contact Person:
                      </span>
                      <p className="font-medium">
                        {advertiser.contactPerson || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="font-medium">
                        {advertiser.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Industry:</span>
                      <p className="font-medium capitalize">
                        {advertiser.industry || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Location:</span>
                      <p className="font-medium">{advertiser.city || "N/A"}</p>
                    </div>
                  </div>

                  {/* Address */}
                  {advertiser.businessAddress && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">Address:</span>
                      <p className="font-medium">
                        {advertiser.businessAddress}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📢</span>
                      <div>
                        <div className="text-sm text-gray-600">Campaigns</div>
                        <div className="font-bold text-lg">
                          {advertiser._count?.campaigns || 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <div>
                        <div className="text-sm text-gray-600">
                          Member Since
                        </div>
                        <div className="font-medium">
                          {new Date(advertiser.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {advertiser.user?.isActive && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ml-auto">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
