import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-white shadow-md flex flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/dondada"
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/dondada"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/users"
            className={`block px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/users"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard Overview
          </h2>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
