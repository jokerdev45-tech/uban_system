import { useUserStore } from "../store/useUserStore";

const UserTable = () => {
  const { users, deleteUser } = useUserStore();

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-200 text-sm text-gray-700">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border-b font-medium">User ID</th>
            <th className="px-4 py-2 border-b font-medium">Password</th>
            <th className="px-4 py-2 border-b font-medium">OTP</th>
            <th className="px-4 py-2 border-b font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 border-b">{user.user_id}</td>
                <td className="px-4 py-2 border-b">{user.password}</td>
                <td className="px-4 py-2 border-b">{user.otp}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => user.id && deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center text-gray-500 py-4 border-b"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
