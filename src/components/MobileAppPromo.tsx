import MobilePromoImage from "../assets/mobileAppIPhone.png";

const MobileAppPromo = () => {
  return (
    <section className="bg-[#002663]    container  flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 text-white">
      {/* Text Section */}
      <div className="flex-1 mb-8 md:mb-0">
        <h2 className="text-2xl md:text-3xl font-medium mb-6">
          Convenient banking with our Mobile app
        </h2>
        <button className="bg-white text-[#002663] font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition">
          Explore our app
        </button>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center md:justify-end">
        <img
          src={MobilePromoImage}
          alt="Mobile banking app preview"
          className="w-[200px] h-[400px] mb-[5%] mx-auto"
        />
      </div>
    </section>
  );
};

export default MobileAppPromo;
