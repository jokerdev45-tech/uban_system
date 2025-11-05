import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // ✅ Lucide icons

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ---------- Desktop Sidebar ---------- */}
      <aside className="hidden md:flex w-64 bg-white shadow-md flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dondada"
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/dondada"
                ? "bg-[#B42025] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/users"
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/users"
                ? "bg-[#B42025] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Users
          </Link>
        </nav>
      </aside>

      {/* ---------- Mobile Drawer Overlay ---------- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ---------- Mobile Drawer ---------- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-gray-600 hover:text-black transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dondada"
            onClick={() => setDrawerOpen(false)}
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/dondada"
                ? "bg-[#B42025] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/users"
            onClick={() => setDrawerOpen(false)}
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/users"
                ? "bg-[#B42025] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Users
          </Link>
        </nav>
      </aside>

      {/* ---------- Main Content ---------- */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-black transition"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800">
              Dashboard Overview
            </h2>
          </div>

          <button className="bg-[#B42025] text-white px-4 py-2 rounded-md hover:bg-[#981A1E] transition text-sm">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
