import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Driver, Vehicle } from "../../types";
import { driverService } from "../../services/driverService";
import { useToast } from "../../contexts/ToastContext";

export default function DriverProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (userStr) {
      fetchDriverData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);

      const driverResponse = await driverService.getDriverProfile();

      if (driverResponse.status === "success" && driverResponse.data) {
        // API returns data.driver with nested vehicles
        const driverData =
          (driverResponse.data as any).driver || driverResponse.data;
        setDriver(driverData);
        setProfileExists(true);

        // Set vehicles from nested data
        if (driverData.vehicles) {
          setVehicles(driverData.vehicles);
        }
      }
    } catch (error: any) {
      console.error("Error fetching driver data:", error);
      // Profile doesn't exist, allow user to create one
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("not found")
      ) {
        setProfileExists(false);
        // Initialize empty driver object for creation
        setDriver({
          driverId: "",
          userId: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dateOfBirth: "",
          driversLicenseNumber: "",
          city: "",
          region: "",
          averageRating: 0,
          totalCampaignsCompleted: 0,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setIsCreating(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver) return;

    try {
      let response;
      if (isCreating) {
        // Create new profile
        response = await driverService.createDriverProfile({
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber,
          dateOfBirth: driver.dateOfBirth,
          driversLicenseNumber: driver.driversLicenseNumber,
          city: driver.city,
          region: driver.region,
        });
        if (response.status === "success") {
          toast.success("Profile created successfully!");
          setIsCreating(false);
          setProfileExists(true);
          // Refresh profile data
          await fetchDriverData();
        }
      } else {
        // Update existing profile
        response = await driverService.updateDriverProfile(driver);
        if (response.status === "success") {
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        isCreating ? "Failed to create profile" : "Failed to update profile"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold mb-4">Driver Profile</h2>
          <p className="text-gray-600 mb-6">
            Please complete your driver profile to start earning with car wrap
            campaigns.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Note: This page will connect to your backend API once you've
            registered and logged in.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/login" className="btn-primary">
              Login
            </a>
            <a href="/register" className="btn-secondary">
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/driver/dashboard")}
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
        <h1 className="text-3xl font-bold">Driver Profile</h1>
      </div>

      {/* Profile Information */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          {!isCreating && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={driver.firstName}
                onChange={(e) =>
                  setDriver({ ...driver, firstName: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={driver.lastName}
                onChange={(e) =>
                  setDriver({ ...driver, lastName: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={driver.phoneNumber || ""}
                onChange={(e) =>
                  setDriver({ ...driver, phoneNumber: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver's License Number
              </label>
              <input
                type="text"
                value={driver.driversLicenseNumber || ""}
                onChange={(e) =>
                  setDriver({ ...driver, driversLicenseNumber: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={driver.city || ""}
                onChange={(e) => setDriver({ ...driver, city: e.target.value })}
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <input
                type="text"
                value={driver.region || ""}
                onChange={(e) =>
                  setDriver({ ...driver, region: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>
          </div>

          {!isCreating && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Average Rating:</span>
                <span className="text-lg font-bold text-primary-600">
                  {Number(driver.averageRating).toFixed(1)} ⭐
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Campaigns Completed:
                </span>
                <span className="text-lg font-bold">
                  {driver.totalCampaignsCompleted}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    driver.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {driver.isVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          )}

          {(isEditing || isCreating) && (
            <div className="mt-6">
              <button type="submit" className="btn-primary">
                {isCreating ? "Create Profile" : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Vehicles Section - Only show if profile exists */}
      {!isCreating && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Vehicles</h2>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="btn-primary"
            >
              + Add Vehicle
            </button>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vehicles added yet. Add your first vehicle to start applying
              for campaigns!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleId}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  {vehicle.photoUrl && (
                    <img
                      src={vehicle.photoUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Color:</span>{" "}
                      {vehicle.color}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {vehicle.vehicleType}
                    </p>
                    <p>
                      <span className="font-medium">Registration:</span>{" "}
                      {vehicle.registrationNumber}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span>{" "}
                      {vehicle.sizeCategory}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn-secondary text-sm flex-1">
                      Edit
                    </button>
                    <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Vehicle Modal (placeholder) */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Vehicle</h3>
            <p className="text-gray-600 mb-4">Vehicle form will go here...</p>
            <button
              onClick={() => setShowAddVehicle(false)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
