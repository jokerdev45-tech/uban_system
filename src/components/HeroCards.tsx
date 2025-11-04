import { CreditCard, Money, Bell } from "@phosphor-icons/react";
import merillLogo from "../assets/merell.png";

interface CardProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  linkText,
  linkUrl,
  icon,
}) => {
  return (
    <div className=" border-r px-2 py-6 hover:shadow-lg transition duration-300">
      <div className="flex flex-col space-x-3">
        <div className="text-2xl text-red-400">{icon}</div>
        <h3 className="text-lg text-red-400">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
      <a href={linkUrl} className="mt-4 text-blue-600 hover:underline">
        {linkText}
      </a>
    </div>
  );
};

const HeroCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 bg-gray-100 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-2">
      <Card
        title="New offer: 6% customized cash back"
        description="Earn more in the category of your choice with the Customized Cash Rewards credit card."
        linkText="Apply now"
        linkUrl="#"
        icon={<CreditCard size={60} color="#273B67" />}
      />

      <Card
        title="Cash offer up to $500"
        description="Check out this offer for new checking customers."
        linkText="See details"
        linkUrl="#"
        icon={<Money size={60} />}
      />

      {/* Card 3 */}
      <Card
        title="Custom mobile alerts"
        description="With our Mobile Banking app alerts, prioritize what you see based on what matters most to you."
        linkText="Get the app"
        linkUrl="#"
        icon={<Bell size={60} />}
      />

      {/* Card 4 */}
      <div className="border-r p-6 hover:shadow-lg transition duration-300">
        <div className="flex flex-col space-x-3">
          <div className="text-2xl">
            <img src={merillLogo} alt="Merill Logo" className="w-16 h-16" />
          </div>
          <h3 className="text-lg text-red-400">Invest the way you want</h3>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Choose your own investments, set your investing goals online or talk
          with an advisor and set goals together.
        </p>
        <a href={"/"} className="mt-4 text-blue-600 hover:underline">
          Get started
        </a>
      </div>
    </div>
  );
};

export default HeroCards;
