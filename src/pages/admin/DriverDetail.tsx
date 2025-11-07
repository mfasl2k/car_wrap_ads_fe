import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import type { Driver, Vehicle } from "../../types";

interface DriverDetails extends Driver {
  user?: {
    userId: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
  vehicles?: Vehicle[];
  _count?: {
    vehicles: number;
    driverCampaigns: number;
  };
}

export default function DriverDetail() {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDriverById(driverId!);

      if (response.status === "success" && response.data) {
        const driverData = (response.data as any).driver || response.data;
        setDriver(driverData);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to load driver details");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVehicle = async (vehicleId: string) => {
    try {
      setVerifying(vehicleId);
      const response = await adminService.verifyDriverVehicle(vehicleId);

      if (response.status === "success") {
        toast.success("Vehicle verified successfully!");
        // Refresh driver details
        await fetchDriverDetails();
      }
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      toast.error("Failed to verify vehicle");
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading driver details...</div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2">Driver not found</h2>
          <button
            onClick={() => navigate("/admin/drivers")}
            className="btn-primary mt-4"
          >
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/drivers")}
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
          Back to All Drivers
        </button>
        <h1 className="text-3xl font-bold">Driver Details</h1>
      </div>

      {/* Driver Profile Card */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">👤</div>
            <div>
              <h2 className="text-2xl font-bold">
                {driver.firstName} {driver.lastName}
              </h2>
              <p className="text-gray-600">{driver.user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {driver.isVerified ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Verified Driver
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Unverified
              </span>
            )}
            {driver.user?.isActive && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Driver Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="font-medium">{driver.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{driver.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Location
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">City:</span>
                <p className="font-medium">{driver.city || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Region:</span>
                <p className="font-medium">{driver.region || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              License & Stats
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">License #:</span>
                <p className="font-medium">
                  {driver.driversLicenseNumber || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Rating:</span>
                <p className="font-medium">
                  ⭐ {Number(driver.averageRating).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {driver._count?.vehicles || driver.vehicles?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {driver._count?.driverCampaigns || 0}
            </div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {driver.totalCampaignsCompleted}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Registered Vehicles</h2>

        {!driver.vehicles || driver.vehicles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-gray-600">No vehicles registered</p>
          </div>
        ) : (
          <div className="space-y-4">
            {driver.vehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">🚗</div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Registration: {vehicle.registrationNumber}
                        </p>
                      </div>
                      {vehicle.isVerified ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          ⏳ Pending
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Color:</span>
                        <p className="font-medium">{vehicle.color || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <p className="font-medium capitalize">
                          {vehicle.vehicleType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Size:</span>
                        <p className="font-medium capitalize">
                          {vehicle.sizeCategory || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Registered:
                        </span>
                        <p className="font-medium">
                          {new Date(vehicle.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {vehicle.photoUrl && (
                      <div className="mt-4">
                        <img
                          src={vehicle.photoUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full max-w-md rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Verify Button */}
                  {!vehicle.isVerified && (
                    <button
                      onClick={() => handleVerifyVehicle(vehicle.vehicleId)}
                      disabled={verifying === vehicle.vehicleId}
                      className="btn-primary ml-4 min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying === vehicle.vehicleId ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        "Verify Vehicle"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
