import { X } from "lucide-react";

export const CreateUserModal = ({
  email,
  password,
  role,
  setEmail,
  setPassword,
  setRole,
  onClose,
  onSubmit,
}: {
  email: string;
  password: string;
  role: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setRole: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <div className="fixed -top-10 inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="relative bg-white w-full max-w-md mx-4 sm:mx-0 rounded-xl p-6 shadow-xl">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>
      <h3 className="text-lg font-semibold mb-4">Create Admin User</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Marketing</option>
            <option value="super-admin">Developer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create & Send Credentials
        </button>
      </form>
    </div>
  </div>
);
