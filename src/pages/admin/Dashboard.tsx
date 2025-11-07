import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage system resources and approvals
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="btn-secondary"
        >
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <div className="card mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="text-5xl">👨‍💼</div>
          <div>
            <h2 className="text-2xl font-bold text-primary-900 mb-1">
              Welcome, Administrator
            </h2>
            <p className="text-primary-700">
              Use the menu below to manage vehicles, drivers, advertisers, and
              campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Admin Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* View All Drivers (includes vehicle verification) */}
        <button
          onClick={() => navigate("/admin/drivers")}
          className="card hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-left p-8"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl">�</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Drivers & Vehicles</h3>
              <p className="text-gray-600 text-sm">
                View drivers and verify their vehicles
              </p>
            </div>
            <div className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Manage Drivers
            </div>
          </div>
        </button>

        {/* View All Advertisers */}
        <button
          onClick={() => navigate("/admin/advertisers")}
          className="card hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-left p-8"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl">🏢</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">All Advertisers</h3>
              <p className="text-gray-600 text-sm">
                View and manage advertiser accounts
              </p>
            </div>
            <div className="mt-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Manage Advertisers
            </div>
          </div>
        </button>

        {/* View All Campaigns */}
        <button
          onClick={() => navigate("/admin/campaigns")}
          className="card hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-left p-8"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl">📢</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">All Campaigns</h3>
              <p className="text-gray-600 text-sm">
                Monitor and manage advertising campaigns
              </p>
            </div>
            <div className="mt-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              View Campaigns
            </div>
          </div>
        </button>

        {/* System Settings */}
        <button
          onClick={() => navigate("/admin/settings")}
          className="card hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-left p-8 opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl">⚙️</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">System Settings</h3>
              <p className="text-gray-600 text-sm">
                Configure platform settings and preferences
              </p>
            </div>
            <div className="mt-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              Coming Soon
            </div>
          </div>
        </button>

        {/* Reports */}
        <button
          onClick={() => navigate("/admin/reports")}
          className="card hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-left p-8 opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl">📊</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Reports & Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                View system statistics and reports
              </p>
            </div>
            <div className="mt-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              Coming Soon
            </div>
          </div>
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-8 card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Admin Features</h3>
            <p className="text-sm text-blue-700">
              View all drivers and verify their vehicles by clicking on a
              driver. Monitor advertisers and campaigns. Additional features
              like system settings and analytics reports are coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
