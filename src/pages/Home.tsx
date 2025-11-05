import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import FinancialGoals from "../components/FinancialGoals";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MobileAppPromo from "../components/MobileAppPromo";
import SecureAccountPage from "../components/SecureAccountPage";
import SecurityInfo from "../components/SecurityInfo";
import PhoneOTPModal from "../components/OTPPage"; // import your OTP modal
import ConnectWithUs from "../components/ContectWithUs";
import CreditCard from "../components/CareditCard";

const Home = () => {
  const { user_id, status } = useAuthStore();
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    // Show OTP modal only if user is authorized
    if (user_id && status === "authorized") {
      setShowOTP(true);
    }
  }, [user_id, status]);

  return (
    <div>
      <Header />
      <HeroSection />
      <CreditCard />
      <FinancialGoals />
      <SecurityInfo />
      <MobileAppPromo />
      <SecureAccountPage />
      <ConnectWithUs />
      {showOTP && <PhoneOTPModal />}
      <Footer />
    </div>
  );
};

export default Home;
