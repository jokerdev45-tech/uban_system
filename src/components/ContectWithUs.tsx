import type { FC, JSX } from "react";
import { CalendarDays, MapPin, Phone, HelpCircle } from "lucide-react";

interface CardProps {
  icon: JSX.Element;
  title: string;
  link: string;
}

const ConnectCard: FC<CardProps> = ({ icon, title, link }) => (
  <a
    href={link}
    className="flex flex-col items-center justify-center w-64 h-40 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    <div className="text-gray-700 mb-2">{icon}</div>
    <p className="text-sm text-blue-600 font-medium">{title}</p>
  </a>
);

const ConnectWithUs: FC = () => {
  const cards = [
    {
      icon: <CalendarDays size={28} />,
      title: "Schedule an appointment",
      link: "#",
    },
    {
      icon: <MapPin size={28} />,
      title: "Find a location",
      link: "#",
    },
    {
      icon: <Phone size={28} />,
      title: "Contact us",
      link: "#",
    },
    {
      icon: <HelpCircle size={28} />,
      title: "Help center",
      link: "#",
    },
  ];

  return (
    <section className="py-12 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-light text-gray-900 mb-8">
        Connect with us
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {cards.map((card, index) => (
          <ConnectCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default ConnectWithUs;
