import { useState, useEffect } from "react";
import type { Driver, Vehicle } from "../types";
import { driverService } from "../services/driverService";

export default function DriverProfile() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      // Replace with actual driver ID from auth context
      const driverId = "current-driver-id";

      const [driverResponse, vehiclesResponse] = await Promise.all([
        driverService.getDriverProfile(driverId),
        driverService.getDriverVehicles(driverId),
      ]);

      if (driverResponse.status === "success" && driverResponse.data) {
        setDriver(driverResponse.data);
      }
      if (vehiclesResponse.status === "success" && vehiclesResponse.data) {
        setVehicles(vehiclesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver) return;

    try {
      const response = await driverService.updateDriverProfile(
        driver.driverId,
        driver
      );
      if (response.status === "success") {
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Driver profile not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Driver Profile</h1>

      {/* Profile Information */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-primary"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleUpdateProfile}>
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
                disabled={!isEditing}
                className="input-field"
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
                disabled={!isEditing}
                className="input-field"
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Average Rating:</span>
              <span className="text-lg font-bold text-primary-600">
                {driver.averageRating.toFixed(1)} ⭐
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Campaigns Completed:</span>
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

          {isEditing && (
            <div className="mt-6">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Vehicles Section */}
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
            No vehicles added yet. Add your first vehicle to start applying for
            campaigns!
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
                    <span className="font-medium">Color:</span> {vehicle.color}
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
                  <button className="btn-secondary text-sm flex-1">Edit</button>
                  <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
