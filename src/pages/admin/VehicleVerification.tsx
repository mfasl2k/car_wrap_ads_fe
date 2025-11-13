import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
import type { Vehicle } from "../../types";

interface VehicleWithDriver extends Vehicle {
  driver?: {
    driverId: string;
    firstName: string;
    lastName: string;
    user?: {
      userId: string;
      email: string;
    };
  };
}

export default function VehicleVerification() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleWithDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllVehicles();

      if (response.status === "success" && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vehiclesData = (response.data as any).vehicles || response.data;
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (vehicleId: string) => {
    try {
      setVerifying(vehicleId);
      const response = await adminService.verifyVehicle(vehicleId);

      if (response.status === "success") {
        toast.success("Vehicle verified successfully!");
        // Refresh the list
        await fetchVehicles();
      }
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      toast.error("Failed to verify vehicle");
    } finally {
      setVerifying(null);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filter === "pending") return !vehicle.isVerified;
    if (filter === "verified") return vehicle.isVerified;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading vehicles...</div>
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
        <h1 className="text-3xl font-bold">Vehicle Verification</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All ({vehicles.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending ({vehicles.filter((v) => !v.isVerified).length})
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "verified"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Verified ({vehicles.filter((v) => v.isVerified).length})
        </button>
      </div>

      {/* Vehicles List */}
      {filteredVehicles.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold mb-2">No vehicles found</h2>
          <p className="text-gray-600">
            {filter === "pending"
              ? "All vehicles have been verified"
              : filter === "verified"
              ? "No verified vehicles yet"
              : "No vehicles in the system"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.vehicleId} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Vehicle Details */}
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
                    <div>
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
                  </div>

                  {/* Vehicle Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                      <span className="text-sm text-gray-600">Registered:</span>
                      <p className="font-medium">
                        {new Date(vehicle.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Driver Info */}
                  {vehicle.driver && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Driver Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <p className="font-medium">
                            {vehicle.driver.firstName} {vehicle.driver.lastName}
                          </p>
                        </div>
                        {vehicle.driver.user && (
                          <div>
                            <span className="text-sm text-gray-600">
                              Email:
                            </span>
                            <p className="font-medium">
                              {vehicle.driver.user.email}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="ml-4">
                  {!vehicle.isVerified && (
                    <button
                      onClick={() => handleVerify(vehicle.vehicleId)}
                      disabled={verifying === vehicle.vehicleId}
                      className="btn-primary min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
