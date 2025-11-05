// src/components/BankLoader.tsx
import React from "react";

type Variant = "spinner" | "skeleton" | "both";

interface BankLoaderProps {
  variant?: Variant;
  message?: string;
  size?: "sm" | "md" | "lg";
  rows?: number; // for skeleton variant: number of skeleton rows
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
} as const;

const BankLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className="inline-block"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="7" width="20" height="2" rx="1" fill="currentColor" />
    <path
      d="M4 21V9l8-4 8 4v12H4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <circle cx="12" cy="14" r="2" fill="currentColor" />
  </svg>
);

const Spinner: React.FC<{ sizePx: number }> = ({ sizePx }) => (
  <svg
    className="animate-spin"
    style={{ width: sizePx, height: sizePx }}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      className="opacity-25"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

/**
 * BankLoader
 *
 * Usage:
 * <BankLoader variant="both" message="Loading your accounts..." size="md" rows={4} />
 */
const BankLoader: React.FC<BankLoaderProps> = ({
  variant = "both",
  message = "Loading…",
  size = "md",
  rows = 3,
}) => {
  const sizePx = sizeMap[size] ?? sizeMap.md;

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 p-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-4">
        <div
          className={`rounded-full bg-linear-to-br from-[#E6EEF8] to-[#DDE9F8] p-3 text-[#344E87]`}
        >
          <BankLogo size={sizePx * 0.6} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <Spinner sizePx={sizePx} />
            <p className="text-sm md:text-base font-medium text-gray-700">
              {message}
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            Secured connection — authenticating
          </p>
        </div>
      </div>

      {(variant === "skeleton" || variant === "both") && (
        <div className="w-full max-w-xl mt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-3 px-4 mb-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 animate-pulse" />
                <div className="flex flex-col">
                  <div className="w-36 h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="w-24 h-2 bg-gray-100 rounded mt-2 animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="w-20 h-3 bg-gray-100 rounded animate-pulse ml-auto" />
                <div className="w-12 h-2 bg-gray-100 rounded mt-2 ml-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankLoader;
