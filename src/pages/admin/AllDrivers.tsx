import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import type { Driver } from "../../types";

interface DriverWithDetails extends Driver {
  user?: {
    userId: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
  vehicles?: Array<{
    vehicleId: string;
    make: string;
    model: string;
    year: number;
    isVerified: boolean;
  }>;
  _count?: {
    vehicles: number;
    driverCampaigns: number;
  };
}

export default function AllDrivers() {
  const navigate = useNavigate();
  const toast = useToast();
  const [drivers, setDrivers] = useState<DriverWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllDrivers();

      if (response.status === "success" && response.data) {
        const driversData = (response.data as any).drivers || response.data;
        setDrivers(Array.isArray(driversData) ? driversData : []);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      driver.firstName?.toLowerCase().includes(searchLower) ||
      driver.lastName?.toLowerCase().includes(searchLower) ||
      driver.user?.email?.toLowerCase().includes(searchLower) ||
      driver.city?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading drivers...</div>
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
          <h1 className="text-3xl font-bold">All Drivers</h1>
          <p className="text-gray-600 mt-1">
            View and manage registered drivers
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Drivers</div>
          <div className="text-3xl font-bold text-blue-900">
            {drivers.length}
          </div>
        </div>
        <div className="card bg-green-50 border-green-200">
          <div className="text-sm text-green-600 font-medium">Verified</div>
          <div className="text-3xl font-bold text-green-900">
            {drivers.filter((d) => d.isVerified).length}
          </div>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="text-sm text-yellow-600 font-medium">Unverified</div>
          <div className="text-3xl font-bold text-yellow-900">
            {drivers.filter((d) => !d.isVerified).length}
          </div>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <div className="text-sm text-purple-600 font-medium">
            With Vehicles
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {drivers.filter((d) => (d._count?.vehicles || 0) > 0).length}
          </div>
        </div>
      </div>

      {/* Drivers List */}
      {filteredDrivers.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold mb-2">
            {searchTerm ? "No drivers found" : "No drivers registered"}
          </h2>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No drivers have registered yet"}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Vehicles
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Campaigns
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.driverId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/drivers/${driver.driverId}`)
                    }
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {driver.firstName} {driver.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          License: {driver.driversLicenseNumber || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm text-gray-900">
                          {driver.user?.email || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {driver.phoneNumber || "No phone"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>{driver.city || "N/A"}</div>
                        <div className="text-gray-500">
                          {driver.region || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {driver._count?.vehicles || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium">
                          {driver._count?.driverCampaigns || 0} total
                        </div>
                        <div className="text-gray-500">
                          {driver.totalCampaignsCompleted} completed
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">
                          {Number(driver.averageRating).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {driver.isVerified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            Unverified
                          </span>
                        )}
                        {driver.user?.isActive && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
