import React from "react";
import Slider from "react-slick";
import { ShieldCheck, Money, CreditCard, Bank } from "@phosphor-icons/react";
import firstImage from "../assets/firstImage.jpg";
import secondImage from "../assets/secondImage.jpg";
import thirdImage from "../assets/thirdImage.jpg";
import fourthImage from "../assets/fourthImage.jpg";

const FinancialGoals: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  // 🧩 Reusable data array
  const cards = [
    {
      id: 1,
      title: "Protect yourself online: 5 new scams to watch out for now",
      icon: <ShieldCheck size={20} className="" />,
      image: firstImage,
    },
    {
      id: 2,
      title: "Feeling pressure to spend? Here's why and how to deal with it",
      icon: <Money size={20} className="" />,
      image: secondImage,
    },
    {
      id: 3,
      title: "What is a certificate of deposit (CD) and how does it work?",
      icon: <Bank size={20} className="" />,
      image: thirdImage,
    },
    {
      id: 4,
      title: "How to choose the right credit card",
      icon: <CreditCard size={20} className="" />,
      image: fourthImage,
    },
  ];

  // 🧱 Reusable Card Component
  const FinancialCard: React.FC<{
    image: string;
    icon: React.ReactNode;
    title: string;
  }> = ({ image, icon, title }) => (
    <div
      className="bg-cover bg-center p-6 h-[360px]  flex flex-col justify-end"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="bg-white flex items-start justify-start p-5 gap-2">
        <span> {icon}</span>
        <p className="font-semibold text-sm text-[#1c65c8]">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Your financial goals matter
        </h2>
        <p className="text-lg text-gray-500 mb-12">
          We can help you achieve them through Better Money financial education
          and programs that make communities stronger.
        </p>

        {/* 📱 Mobile Carousel */}
        <div className="block lg:hidden">
          <Slider {...settings}>
            {cards.map((card) => (
              <FinancialCard
                key={card.id}
                image={card.image}
                icon={card.icon}
                title={card.title}
              />
            ))}
          </Slider>
        </div>

        {/* 💻 Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 ">
          {cards.map((card) => (
            <FinancialCard
              key={card.id}
              image={card.image}
              icon={card.icon}
              title={card.title}
            />
          ))}
        </div>

        {/* 🔗 CTA Button */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="inline-block bg-blue-600 text-white px-6 py-3 text-lg font-semibold rounded-full hover:bg-blue-700"
          >
            Visit Better Money Habits®
          </a>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoals;
