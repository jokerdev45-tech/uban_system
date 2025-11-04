/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface AuthState {
  id: number | null; // 👈 Added numeric database ID
  user_id: string | null;
  password: string | null;
  loading: boolean;
  error: string | null;
  status: "pending" | "authorized" | "rejected" | null;

  login: (userID: string, password: string) => Promise<"authorized" | "rejected">;
  logout: () => void;
  setUserId: (userID: string | null) => void;
  setAuthData: (id: number, user_id: string) => void; // 👈 Added helper
}

/* ----- Debug helper ----- */
const DEBUG = true;
function logDebug(...args: any[]) {
  if (DEBUG) console.log("🛠️ [AuthStore Debug]", ...args);
}

/* ----- Helper to poll authorization ----- */
async function waitForAuthorization(
  id: number,
  timeout = 60000
): Promise<"authorized" | "rejected"> {
  const start = Date.now();
  logDebug("⏳ Starting waitForAuthorization", { id, timeout });

  while (Date.now() - start < timeout) {
    try {
      logDebug("📡 Polling server for authorization status...");
      const res = await fetch(`http://localhost:4000/api/status/${id}`);
      logDebug("📥 Poll response status:", res.status);

      if (!res.ok) {
        logDebug("⚠️ Polling failed (status not OK). Retrying soon...");
        await new Promise((r) => setTimeout(r, 2000));
        continue; // ✅ retry instead of rejecting
      }

      const data = await res.json().catch(() => ({}));
      logDebug("📊 Poll response data:", data);

      if (data.status === "authorized" || data.status === "rejected") {
        logDebug("✅ Final authorization status reached:", data.status);
        return data.status;
      }

      logDebug("⏱️ Status not final yet, waiting 2 seconds before next poll...");
    } catch (err) {
      logDebug("💥 Polling error:", err);
      // ✅ Instead of rejecting, wait a bit and retry
      await new Promise((r) => setTimeout(r, 3000));
      continue;
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  logDebug("⏰ Polling timed out (no final status)");
  return "rejected";
}

/* ----- Store ----- */
export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  user_id: null,
  password: null,
  status: null,
  loading: false,
  error: null,

  login: async (userID, password) => {
    logDebug("🚀 Login started", { userID });
    set({ loading: true, error: null, status: "pending" });

    try {
      logDebug("📤 Sending login POST request to server...");
      const res = await fetch("http://localhost:4000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userID, password }),
      });

      logDebug("📥 Server response status:", res.status);
      const data = await res.json().catch(() => ({}));
      logDebug("✅ Server response data:", data);

      if (!res.ok || !data.id) {
        throw new Error(data.error || "Failed to save user");
      }

      const recordId = data.id;
      logDebug("📝 Login record saved with ID:", recordId);

      // 👇 Save ID and user_id immediately
      set({ id: recordId, user_id: userID });

      logDebug("⏳ Begin polling for admin authorization...");
      const authStatus = await waitForAuthorization(recordId);
      logDebug("🏁 Authorization polling finished, status:", authStatus);

      logDebug("🔄 Updating store state based on auth status...");
      set({
        status: authStatus,
        password: authStatus === "authorized" ? password : null,
        loading: false,
        error: authStatus === "authorized" ? null : "Login rejected by admin",
      });

      if (authStatus === "authorized") logDebug("✅ Login successfully authorized!");
      else logDebug("❌ Login rejected by admin");

      return authStatus;
    } catch (err: any) {
      logDebug("💥 Login error caught:", err);
      set({ loading: false, error: err.message || "Login failed", status: "rejected" });
      return "rejected";
    }
  },

  logout: () => {
    logDebug("🔒 Logout called, clearing store state");
    set({ id: null, user_id: null, password: null, error: null, status: null });
  },

  setUserId: (userID: string | null) => {
    logDebug("🔧 setUserId called with:", userID);
    set({ user_id: userID });
  },

  setAuthData: (id: number, user_id: string) => {
    logDebug("🔧 setAuthData called with:", { id, user_id });
    set({ id, user_id });
  },
}));
