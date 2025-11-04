import HeroImage from "../assets/assets-images-site-hp-assets-mastheads-consumer-enterprise-en-project_sunshine-ent_mh_lbifebbmh_5455830_1440_gc_a.webp";
import LoginForm from "./form";
import cardImage from "../assets/assets-images-site-hp-assets-super-highlights-consumer-cards-en-ba_shl_cards_722_5794531_e.png";
import HeroCards from "./HeroCards";

const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4">
      {/* === HERO AREA === */}
      <div
        className="my-8 bg-cover bg-center  shadow-lg flex flex-col lg:flex-row items-center lg:items-start justify-between p-6 sm:p-10 lg:p-16 gap-10"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        {/* LOGIN FORM */}
        <div className="w-full max-w-sm shrink-0">
          <LoginForm />
        </div>

        {/* TEXT SECTION */}
        <div className="relative z-10 text-center lg:text-left  p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl text-red-700 font-bold leading-snug">
            With financial education, the future looks brighter
          </h1>
          <p className="text-gray-800 mt-4 text-base md:text-lg">
            Get free and actionable guidance from Better Money Habits® to help
            improve your financial health.
          </p>
          <button className="mt-6 px-6 py-3 bg-[#344E87] text-white font-medium rounded-full hover:bg-blue-800 transition-all">
            Keep moving forward
          </button>
        </div>
      </div>

      {/* === BOTTOM SECTION === */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* LEFT CARD SECTION */}
        <div className="bg-[#273B67] w-full text-white  overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="bg-white text-gray-800 m-5 p-5 rounded-lg shadow-md max-w-md">
            <h2 className="text-red-600 text-xl md:text-2xl font-semibold mb-3">
              Explore our credit cards
            </h2>
            <p className="text-sm md:text-base mb-3">
              Choose the right card for you. You can check for personalized
              offers in 30 seconds.
            </p>
            <a
              href="#"
              className="text-blue-700 hover:underline font-medium text-sm md:text-base"
            >
              Get started
            </a>
          </div>

          <div className="flex justify-center items-center w-full lg:w-auto">
            <img
              src={cardImage}
              alt="Credit cards"
              className="w-full max-w-sm md:max-w-md object-contain"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-red-600 text-white w-full flex flex-col justify-center items-center p-6 text-center">
          <h2 className="text-lg md:text-xl font-semibold">
            U.S. government budget impacts
          </h2>
          <p className="text-sm md:text-base mt-2 mb-3 max-w-sm">
            If you are experiencing financial challenges, we’re here to help.
          </p>
          <a
            href="#"
            className="text-white underline font-medium hover:text-gray-100"
          >
            Learn more
          </a>
        </div>
      </div>
      <HeroCards />
    </section>
  );
};

export default HeroSection;
