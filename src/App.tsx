import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DriverDashboard from "./pages/driver/Dashboard";
import AdvertiserDashboard from "./pages/advertiser/Dashboard";
import DriverProfile from "./pages/driver/Profile";
import AdvertiserProfile from "./pages/advertiser/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/advertiser/profile" element={<AdvertiserProfile />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
