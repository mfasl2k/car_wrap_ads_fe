import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { advertiserService } from "../../services/advertiserService";
import type { Advertiser } from "../../types";

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const response = await advertiserService.getAdvertiserProfile();
      if (response.status === "success" && response.data) {
        const advertiserData =
          (response.data as any).advertiser || response.data;
        setAdvertiser(advertiserData);
        setHasProfile(true);
      }
    } catch (error: any) {
      // Profile doesn't exist yet
      console.log("No profile found:", error);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📢</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Advertiser Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasProfile && advertiser ? (
          // Profile exists - show dashboard overview
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Welcome back! 👋</h2>
              <p className="text-gray-600 mb-6">
                Here's your advertiser dashboard overview.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 font-medium">
                    Company
                  </div>
                  <div className="text-xl font-bold text-primary-700">
                    🏢 {advertiser.companyName || "Not set"}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">
                    Industry
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    💼 {advertiser.industry || "Not set"}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">
                    Website
                  </div>
                  <div className="text-sm font-bold text-blue-700 truncate">
                    🌐 {advertiser.website || "Not set"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/advertiser/profile")}
                className="btn-primary w-full md:w-auto"
              >
                View Full Profile →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold">Create Campaign</div>
                  <div className="text-sm text-gray-600">
                    Launch a new ad campaign
                  </div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">View Campaigns</div>
                  <div className="text-sm text-gray-600">
                    Manage your campaigns
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // No profile - show setup prompt
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="text-6xl mb-6">📢</div>
              <h2 className="text-3xl font-bold mb-4">
                Welcome to Car Wrap Ads!
              </h2>
              <p className="text-gray-600 mb-8">
                You're almost ready to start promoting your brand. Complete your
                advertiser profile to get started.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">
                  What you'll need:
                </h3>
                <ul className="text-left space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Company information (name, industry)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Contact details (phone, website)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Business description</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/advertiser/profile")}
                className="btn-primary text-lg px-8 py-3 w-full md:w-auto"
              >
                Create Advertiser Profile →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
