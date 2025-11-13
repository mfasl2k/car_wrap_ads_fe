import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DriverDashboard from "./pages/driver/Dashboard";
import AdvertiserDashboard from "./pages/advertiser/Dashboard";
import DriverProfile from "./pages/driver/Profile";
import AdvertiserProfile from "./pages/advertiser/Profile";
import BrowseCampaigns from "./pages/driver/BrowseCampaigns";
import MyApplications from "./pages/driver/MyApplications";
import CreateCampaign from "./pages/advertiser/CreateCampaign";
import ViewCampaigns from "./pages/advertiser/ViewCampaigns";
import CampaignDetail from "./pages/advertiser/CampaignDetail";
import CampaignApplications from "./pages/advertiser/CampaignApplications";
import AdminDashboard from "./pages/admin/Dashboard";
import AllDrivers from "./pages/admin/AllDrivers";
import DriverDetail from "./pages/admin/DriverDetail";
import AllAdvertisers from "./pages/admin/AllAdvertisers";
import AllCampaigns from "./pages/admin/AllCampaigns";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/campaigns" element={<BrowseCampaigns />} />
        <Route path="/driver/applications" element={<MyApplications />} />
        <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />
        <Route path="/advertiser/profile" element={<AdvertiserProfile />} />
        <Route path="/advertiser/campaigns" element={<ViewCampaigns />} />
        <Route
          path="/advertiser/campaigns/create"
          element={<CreateCampaign />}
        />
        <Route
          path="/advertiser/campaigns/:campaignId"
          element={<CampaignDetail />}
        />
        <Route
          path="/advertiser/campaigns/:campaignId/applications"
          element={<CampaignApplications />}
        />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/drivers" element={<AllDrivers />} />
        <Route path="/admin/drivers/:driverId" element={<DriverDetail />} />
        <Route path="/admin/advertisers" element={<AllAdvertisers />} />
        <Route path="/admin/campaigns" element={<AllCampaigns />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
