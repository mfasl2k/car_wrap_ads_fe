import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Advertiser } from "../../types";
import { advertiserService } from "../../services/advertiserService";
import toast from "react-hot-toast";

export default function AdvertiserProfile() {
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (userStr) {
      fetchAdvertiserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdvertiserData = async () => {
    try {
      setLoading(true);

      const advertiserResponse = await advertiserService.getAdvertiserProfile();

      if (advertiserResponse.status === "success" && advertiserResponse.data) {
        // Handle both nested and direct response structure
        const advertiserData =
          (advertiserResponse.data as any).advertiser ||
          advertiserResponse.data;
        setAdvertiser(advertiserData);
        setProfileExists(true);
        setIsCreating(false);
      }
    } catch (error: any) {
      console.error("Error fetching advertiser data:", error);
      // Profile doesn't exist, allow user to create one
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("not found")
      ) {
        setProfileExists(false);
        // Initialize empty advertiser object for creation
        setAdvertiser({
          advertiserId: "",
          userId: "",
          companyName: "",
          contactPerson: "",
          phoneNumber: "",
          businessAddress: "",
          city: "",
          industry: "",
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
    if (!advertiser) return;

    try {
      let response;
      if (isCreating) {
        // Create new profile
        response = await advertiserService.createAdvertiserProfile({
          companyName: advertiser.companyName,
          contactPerson: advertiser.contactPerson,
          phoneNumber: advertiser.phoneNumber,
          businessAddress: advertiser.businessAddress,
          city: advertiser.city,
          industry: advertiser.industry,
        });
        if (response.status === "success") {
          toast.success("Profile created successfully!");
          setIsCreating(false);
          setProfileExists(true);
          // Refresh profile data
          await fetchAdvertiserData();
        }
      } else {
        // Update existing profile
        response = await advertiserService.updateAdvertiserProfile(advertiser);
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

  if (!advertiser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">📢</div>
          <h2 className="text-2xl font-bold mb-4">Advertiser Profile</h2>
          <p className="text-gray-600 mb-6">
            Please complete your advertiser profile to start creating car wrap
            advertising campaigns.
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
          onClick={() => navigate("/advertiser/dashboard")}
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
        <h1 className="text-3xl font-bold">Advertiser Profile</h1>
      </div>

      {/* Company Information */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Company Information</h2>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={advertiser.companyName}
                onChange={(e) =>
                  setAdvertiser({ ...advertiser, companyName: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={advertiser.contactPerson || ""}
                onChange={(e) =>
                  setAdvertiser({
                    ...advertiser,
                    contactPerson: e.target.value,
                  })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={advertiser.phoneNumber || ""}
                onChange={(e) =>
                  setAdvertiser({ ...advertiser, phoneNumber: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                value={advertiser.businessAddress || ""}
                onChange={(e) =>
                  setAdvertiser({
                    ...advertiser,
                    businessAddress: e.target.value,
                  })
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
                value={advertiser.city || ""}
                onChange={(e) =>
                  setAdvertiser({ ...advertiser, city: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={advertiser.industry || ""}
                onChange={(e) =>
                  setAdvertiser({ ...advertiser, industry: e.target.value })
                }
                disabled={!isEditing && !isCreating}
                className="input-field"
              />
            </div>
          </div>

          {!isCreating && (
            <div className="mt-6">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  advertiser.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {advertiser.isVerified
                  ? "Verified Business"
                  : "Pending Verification"}
              </span>
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
    </div>
  );
}
