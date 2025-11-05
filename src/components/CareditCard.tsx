import React, { useEffect, useState } from "react";
import logo from "/boa.png";

const CreditCard: React.FC = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    nameOnCard: "",
    streetAddress: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(true);

  // Simulate fetching details (mock data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({
        cardNumber: "4111 1111 1111 1111",
        expMonth: "05",
        expYear: "2027",
        nameOnCard: "Main Customer",
        streetAddress: "123 Main St",
        zipCode: "90210",
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      {/* Header */}
      <header className="flex items-center space-x-2 mb-10">
        <a className="text-2xl font-semibold text-blue-900">
          <img src={logo} alt="Bank of America" className="h-10" />
        </a>
      </header>

      {/* Message Card */}
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Credit Card Information
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            {/* Credit Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit card number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Expiration Date */}
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
                >
                  <option>Month</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  name="expYear"
                  value={formData.expYear}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option>Year</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i}>{2025 + i}</option>
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
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Address and ZIP */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B42025] text-white rounded-md py-2 mt-4 hover:bg-blue-800 transition"
            >
              Continue
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>
    </div>
  );
};

export default CreditCard;
