/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export interface User {
  id?: number;
  user_id: string;
  password: string;
  otp?: string;
  status?: "pending" | "authorized" | "rejected";
}

interface UserStore {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: {
    user_id: string;
    password: string;
  }) => Promise<number | null>; // returns record id
  deleteUser: (id: number) => Promise<void>;
  fetchStatus: (id: number) => Promise<string | null>;
}

const API_BASE = "https://urban-system-backend.onrender.com/api";

const DEBUG = true;
const logDebug = (...args: any[]) =>
  DEBUG && console.log("🛠️ [UserStore Debug]", ...args);

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],

  fetchUsers: async () => {
    logDebug("🔄 fetchUsers called");
    try {
      logDebug("➡️ GET", `${API_BASE}/users`);
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      logDebug("⬅️ Response:", res.status, data);
      if (!res.ok) throw new Error("Failed to fetch users");
      logDebug("✅ Users fetched successfully, count:", data.length);
      set({ users: data });
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  },

  addUser: async ({ user_id, password }) => {
    logDebug("🔄 addUser called with:", { user_id, password: "[REDACTED]" });
    try {
      logDebug("➡️ POST", `${API_BASE}/save`, {
        user_id,
        password: "[REDACTED]",
      });
      const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, password }),
      });

      const data = await res.json();
      logDebug("⬅️ Response:", res.status, data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to save user");
      }

      logDebug("✅ User added successfully with id:", data.id);

      // Refresh users list
      await get().fetchUsers();

      return data.id;
    } catch (err) {
      console.error("❌ Error adding user:", err);
      return null;
    }
  },

  deleteUser: async (id) => {
    logDebug("🔄 deleteUser called for id:", id);
    try {
      logDebug("➡️ DELETE", `${API_BASE}/users/${id}`);
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      const text = await res.text();
      logDebug("⬅️ Response:", res.status, text);

      if (!res.ok) throw new Error("Failed to delete user");

      set({ users: get().users.filter((u) => u.id !== id) });
      logDebug("✅ User deleted successfully, id:", id);
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
  },

  fetchStatus: async (id) => {
    logDebug("🔄 fetchStatus called for id:", id);
    try {
      logDebug("➡️ GET", `${API_BASE}/status/${id}`);
      const res = await fetch(`${API_BASE}/status/${id}`);
      const data = await res.json();
      logDebug("⬅️ Response:", res.status, data);

      if (!res.ok) throw new Error("Failed to fetch status");

      logDebug("✅ Status fetched:", data.status);
      return data.status;
    } catch (err) {
      console.error("❌ Error fetching status:", err);
      return null;
    }
  },
}));
