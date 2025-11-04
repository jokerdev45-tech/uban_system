import React from "react";
import phoneimage from "../assets/phoneImage.webp";
const SecurityInfo: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-6  lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Your news and information
        </h2>

        {/* Content Section */}
        <div className="lg:flex lg:items-center lg:space-x-12">
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Level up your account security
            </h3>
            <p className="text-lg text-gray-500 mb-6">
              Watch your security meter rise as you take action to help protect
              against fraud. See it in the Security Center in Mobile and Online
              Banking.
            </p>
            <a
              href="#"
              className="inline-block bg-[#a50e28] text-white px-6 py-3 text-lg font-semibold rounded-full hover:bg-red-700"
            >
              Check your level
            </a>
          </div>

          {/* Image Section (Phone image with security meter) */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="relative w-full h-96">
              {/* Phone Image */}
              <img
                src={phoneimage} // Replace with the actual phone image path
                alt="Phone displaying security meter"
                className="w-[200px]  h-[400px] mx-auto mt-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;
