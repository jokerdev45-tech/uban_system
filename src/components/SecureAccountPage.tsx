import logo from "/boa.png";

interface SecureAccountPageProps {
  title?: string;
  message?: string;
}
const SecureAccountPage: React.FC<SecureAccountPageProps> = ({ title }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      {/* Header */}
      <header className="flex items-center space-x-2 mb-10">
        <a className="text-2xl font-semibold text-blue-900">
          <img src={logo} alt="Bank of America" />
        </a>
      </header>

      {/* Message Card */}
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-6 text-center border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Thank you for being a loyal Bank of America customer
        </h2>
        <p className="text-gray-600 mb-4">
          Don’t worry — we’re securing your {title} now.
        </p>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>
    </div>
  );
};

export default SecureAccountPage;
