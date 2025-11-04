import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  // Pinterest,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer: React.FC = () => {
  const links = [
    "Locations",
    "Contact Us",
    "Help & Support",
    "Browse with Specialist",
    "Accessible Banking",
    "Privacy",
    "Children’s Privacy",
    "Security",
    "Online Banking Service Agreement",
    "AdChoices",
    "Your Privacy Choices",
    "Site Map",
    "Careers",
    "Share Your Feedback",
    "View Full Online Banking Site",
  ];

  return (
    <footer className="bg-[#002868] text-white text-sm">
      {/* Top navigation links */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-b border-blue-900">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
          {links.map((item, i) => (
            <React.Fragment key={i}>
              <a
                href="#"
                className="hover:underline whitespace-nowrap text-gray-200 hover:text-white transition-colors"
              >
                {item}
              </a>
              {i < links.length - 1 && (
                <span className="hidden md:inline text-blue-300">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Social media + legal */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-center">
        <h2 className="text-base font-semibold mb-4">Connect with us</h2>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-6 text-white">
          <a href="#" aria-label="Facebook" className="hover:text-gray-300">
            <Facebook size={22} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-300">
            <Instagram size={22} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-gray-300">
            <Linkedin size={22} />
          </a>
          {/* <a href="#" aria-label="Pinterest" className="hover:text-gray-300">
            <Pinterest size={22} />
          </a> */}
          <a href="#" aria-label="Twitter / X" className="hover:text-gray-300">
            <Twitter size={22} />
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-gray-300">
            <Youtube size={22} />
          </a>
        </div>

        {/* Legal text */}
        <div className="space-y-2 text-xs text-gray-300">
          <p>
            Bank of America, N.A. Member FDIC.{" "}
            <a href="#" className="underline hover:text-white">
              Equal Housing Lender
            </a>
          </p>
          <p>© 2025 Bank of America Corporation. All rights reserved.</p>
          <p>
            <a href="#" className="underline hover:text-white">
              Patent: patents.bankofamerica.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
