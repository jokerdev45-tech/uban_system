import { useState } from "react";
import { X, List } from "@phosphor-icons/react";
import logo from "../assets/screenlogo.png";
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    "Enroll",
    "Schedule an appointment",
    "Get the app",
    "Help with home loan payments",
    "Business",
    "Wealth Management",
    "Privacy & Security",
    "About Us",
    "En español",
    "Contact Us",
    "Help",
  ];

  return (
    <div className="relative block md:hidden bg-white">
      <div className="flex justify-between  items-center gap-12 w-full px-4">
        {/* === Mobile Menu Button === */}
        <button onClick={() => setIsOpen(true)} className="p-2 text-[#273B67] ">
          <List size={30} />
        </button>

        {/* === Logo + Label (Mobile Only) === */}
        <a href="/" className="flex flex-col items-center md:hidden">
          <img
            src={logo}
            alt="Bank of America Logo"
            className="h-8 w-auto leading-none align-bottom"
          />
          <p className="text-sm font-light text-[#273B67]">Fraud Prevention</p>
        </a>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Sidebar menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4 text-blue-700 text-sm">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={() => setIsOpen(false)} // closes menu when clicking a link
              className={`hover:underline ${
                ["Business", "Wealth Management", "About Us"].includes(item)
                  ? "pt-2 border-t border-gray-200"
                  : ""
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileMenu;
