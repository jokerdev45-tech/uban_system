import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/boa.png";
import Model from "./Model";
interface LoginFormInputs {
  user_id: string;
  password: string;
  saveuser_id: boolean;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<LoginFormInputs>();
  const { errors } = formState;

  const { login, loading, error } = useAuthStore();
  const [overlay, setOverlay] = useState(false);
  const [, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log("🛠️ Login attempt:", {
      user_id: data.user_id,
      password: "[REDACTED]",
    });
    setOverlay(true);
    setStatusMessage("Waiting for admin authorization...");

    try {
      const authStatus = await login(data.user_id, data.password);
      console.log("🛠️ Login finished, status:", authStatus);

      if (authStatus === "authorized") {
        setStatusMessage("✅ Login authorized!");
        useAuthStore.getState().setUserId(data.user_id); // store user ID globally
        navigate("/"); // go to Home page
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setStatusMessage("💥 Unexpected login error");
    } finally {
      setOverlay(false);
    }
  };

  return (
    <div className="relative max-w-sm mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Overlay while loading */}
      {overlay && (
        <Model isOpen={true}>
          <div className="absolute inset-0 bg-white backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo */}
              <img
                src={logo} // <-- replace with your actual logo path
                alt="App Logo"
                className="w-2 h-16 object-contain"
              />

              {/* Loader Spinner */}
              <div className="w-12 h-12 border-4 border-[#344E87] border-t-transparent rounded-full animate-spin" />

              {/* Text */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Processing...
                </p>
                <p className="text-sm text-gray-500 max-w-xs">
                  Secured connection — authenticating
                </p>
              </div>
            </div>
          </div>
        </Model>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
          Sign In
        </h2>

        {/* User ID */}
        <div className="mb-4">
          <label
            htmlFor="user-id"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            User ID
          </label>
          <input
            id="user-id"
            type="text"
            {...register("user_id", { required: "User ID is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your user ID"
          />
          {errors.user_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.user_id.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Save User ID */}
        <div className="flex items-center mb-4">
          <input
            id="save-user-id"
            type="checkbox"
            {...register("saveuser_id")}
            className="mr-2"
          />
          <label htmlFor="save-user-id" className="text-sm text-gray-600">
            Save user ID
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || overlay}
          className={`w-full text-white py-2 rounded-md transition ${
            loading || overlay
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#344E87] hover:bg-[#2b3f6d]"
          }`}
        >
          {loading || overlay ? "Logging in..." : "Log In"}
        </button>

        {/* Links */}
        <div className="mt-4 text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline block">
            Forgot user ID/password
          </a>
          <a href="#" className="text-blue-600 hover:underline block mt-1">
            Security & Help
          </a>
        </div>
      </form>

      <div className="mt-6 text-center">
        <a href="" className="text-blue-600 hover:underline">
          Open an account
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
