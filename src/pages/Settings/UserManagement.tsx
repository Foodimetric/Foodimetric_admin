import { UserPlus } from "lucide-react";

export const UserManagement = ({ onAdd }: { onAdd: () => void }) => (
  <div className="bg-white rounded-xl shadow p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        <UserPlus size={18} /> Add Admin User
      </button>
    </div>
  </div>
);
