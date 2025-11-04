// src/components/CardsSection.tsx
import React from "react";

const CardsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      <h2 className="text-center text-3xl font-bold mb-8">New Offer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Customized Cash Rewards</h3>
          <p className="mt-2 text-gray-600">
            6% choice category cash back offer
          </p>
          <button className="bg-blue-600 text-white py-2 px-4 mt-4 rounded">
            Apply Now
          </button>
        </div>
        {/* Repeat similar card structure for other offers */}
      </div>
    </section>
  );
};

export default CardsSection;
