import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils"; // Adjust path as needed
import { useActivityLog } from "../Activity-log/context/ActivityLogContext";

export const CreateUserModal = ({
  email,
  password,
  role,
  name,
  setEmail,
  setPassword,
  setRole,
  setName,
  onClose,
}: {
  email: string;
  password: string;
  role: string;
  name: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setRole: (val: string) => void;
  setName: (val: string) => void;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { logActivity } = useActivityLog();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const isSuperAdmin = userRole === "super-admin" || userRole === "super_admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      setError("Access denied. Only super admins can create admin users.");
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/create-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
            role: role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message ||
            errorData?.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Admin created successfully:", result);

      await logActivity("Created a new admin user", {
        admin_name: name.trim(),
        admin_email: email.trim(),
        admin_role: role,
        // created_admin_id: result?.admin_id || result?.id || "unknown",
      });

      setSuccess(
        "Admin user created successfully! Credentials have been sent."
      );

      setTimeout(() => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("admin");
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating admin:", error);

      // await logActivity("Failed to create admin user", {
      //   attempted_name: name.trim(),
      //   attempted_email: email.trim(),
      //   attempted_role: role,
      //   error_message: error instanceof Error ? error.message : "Unknown error",
      // });

      setError(
        error instanceof Error ? error.message : "Failed to create admin user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    const hasData = name.trim() || email.trim() || password.trim();
    if (hasData) {
      await logActivity("Cancelled admin user creation", {
        partial_data: {
          name: name.trim() || null,
          email: email.trim() || null,
          role: role,
        },
      });
    }

    onClose();
  };

  return (
    <div className="fixed -top-10 inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-md mx-4 sm:mx-0 rounded-xl p-6 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4">Create Admin User</h3>

        {/* Role permission check message */}
        {!isSuperAdmin && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            ⚠️ Access denied. Only super admins can create admin users.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading || !isSuperAdmin}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading || !isSuperAdmin}
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
              disabled={loading || !isSuperAdmin}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={loading || !isSuperAdmin}
            >
              <option value="admin">Admin</option>
              <option value="marketing">Marketing</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !isSuperAdmin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create & Send Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};
