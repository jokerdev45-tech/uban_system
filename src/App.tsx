import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PhoneOTPModal from "./components/OTPPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SecureAccountPage from "./components/SecureAccountPage";
import Edit from "./pages/Edit";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dondada"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <Edit />
          </Layout>
        }
      />

      {/* OTP modal route is also under home layout */}
      <Route path="/verify-phone/:userId" element={<PhoneOTPModal />} />
      <Route path="/secure-account" element={<SecureAccountPage />} />
    </Routes>
  );
};

export default App;
