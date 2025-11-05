import { MagnifyingGlass, Globe } from "@phosphor-icons/react";
import MobileMenu from "./mobileNav";
import logo from "../assets/screenlogo.png";

const Header: React.FC = () => {
  return (
    <header className="font-sans bg-white border-b border-gray-200 text-sm sticky top-0 z-50">
      {/* === TOP BAR === */}
      <div className="w-full text-center font-medium md:py-1 border-b border-gray-200 text-gray-600 text-xs ">
        Bank of America deposit products:{" "}
        <span className="font-semibold">FDIC</span> Insured – Backed by the full
        faith and credit of the U.S. Government
      </div>

      {/* === MAIN NAVIGATION BAR === */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center py-3 px-4 bg-white">
        <div className="flex items-center space-x-8">
          {/* LEFT NAV (DESKTOP) */}
          <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
            <a href="#" className="text-red-700 border-b-2 border-red-700 pb-1">
              Personal
            </a>
            <a href="#" className="hover:text-red-700">
              Business
            </a>
            <a href="#" className="hover:text-red-700">
              Wealth Management
            </a>
            <a href="#" className="hover:text-red-700">
              Corporations & Institutions
            </a>
          </nav>
        </div>

        {/* RIGHT NAV (DESKTOP) */}
        <nav className="hidden md:flex items-center space-x-4 text-gray-700">
          <a href="#" className="hover:text-red-700">
            Security
          </a>
          <a href="#" className="hover:text-red-700">
            About Us
          </a>
          <a href="#" className="hover:text-red-700 flex items-center">
            <Globe size={16} className="mr-1" /> En español
          </a>
          <a href="#" className="hover:text-red-700">
            Contact Us
          </a>
          <a href="#" className="hover:text-red-700">
            Help
          </a>
          <div className="flex items-center border rounded px-2 py-1">
            <input
              placeholder="Search"
              className="outline-none text-xs w-28 bg-transparent"
            />
            <MagnifyingGlass size={16} className="ml-1 text-gray-600" />
          </div>
        </nav>
      </div>

      {/* === SECONDARY NAV (DESKTOP ONLY) === */}
      <div className="hidden md:flex max-w-7xl  mx-auto items-center py-3 px-4 space-x-8 font-medium text-gray-700 border-t border-gray-100 bg-white">
        {/* LOGO */}
        <a href="/" className="hidden md:flex bg-white  items-center">
          <img
            src={logo}
            alt="Bank of America Logo"
            className="h-10 w-auto border-0"
          />
        </a>
        <nav className="flex items-center space-x-6 text-gray-700">
          <a href="#" className="hover:text-red-700">
            Checking ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Savings & CDs ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Credit Cards ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Home Loans ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Auto Loans ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Merrill Investing ▾
          </a>
          <a href="#" className="hover:text-red-700">
            Better Money Habits® ▾
          </a>
        </nav>
      </div>

      {/* MOBILE NAVIGATION */}
      <MobileMenu />
    </header>
  );
};

export default Header;
