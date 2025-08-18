import { User } from "../../types/user";
import { X } from "lucide-react";
import { useState } from "react";
import { useAnalytics } from "../../../../contexts/AnalyticsContext";

interface Props {
  user: User;
  onClose: () => void;
}

// interface UserFromAnalytics {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   isVerified: boolean;
//   category: number;
//   googleId?: string;
//   credits: number;
//   lastUsageDate?: string;
//   suspended?: boolean;
// }

const getRoleName = (category: number) => {
  switch (category) {
    case 1:
      return "Lecturer / Researcher";
    case 2:
      return "Registered Dietitian / Clinical Nutritionist";
    case 3:
      return "Nutrition Student";
    default:
      return "Others";
  }
};

export const UserDetailModal = ({ user: initialUser, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { analytics } = useAnalytics();

  // Get updated user data from analytics context or use initial user
  const analyticsUser = analytics?.allUsers.find(
    (u: any) => u._id === initialUser.id
  );

  // Create a unified user object with consistent property names
  const user = analyticsUser
    ? {
        id: analyticsUser._id,
        firstName: analyticsUser.firstName,
        lastName: analyticsUser.lastName,
        email: analyticsUser.email,
        verified: analyticsUser.isVerified,
        category: analyticsUser.category,
        googleId: analyticsUser.googleId,
        credits: analyticsUser.credits,
        lastUsageDate: analyticsUser.lastUsageDate,
        suspended: analyticsUser.suspended || false,
      }
    : initialUser;

  // Get current user role from localStorage
  const currentUserRole = localStorage.getItem("userRole");
  const isSuperAdmin = currentUserRole === "super_admin";
  const isAdmin = currentUserRole === "admin";
  const canAccessDangerZone = isSuperAdmin || isAdmin;

  const showMessage = (
    msg: string,
    _type: "success" | "error" | "warning" = "success"
  ) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSuspendUser = async () => {
    if (!canAccessDangerZone) {
      showMessage("Only admins and super admins can suspend users", "warning");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to suspend ${user.firstName} ${user.lastName}?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users/${user.id}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showMessage("User suspended successfully", "success");
        // You might want to refresh the user data here
      } else {
        throw new Error("Failed to suspend user");
      }
    } catch (error) {
      showMessage("Failed to suspend user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async () => {
    if (!canAccessDangerZone) {
      showMessage("Only admins and super admins can activate users", "warning");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to activate ${user.firstName} ${user.lastName}?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users/${user.id}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showMessage("User activated successfully", "success");
      } else {
        throw new Error("Failed to activate user");
      }
    } catch (error) {
      showMessage("Failed to activate user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!isSuperAdmin) {
      showMessage("Only super admins can delete users", "warning");
      return;
    }

    if (
      !window.confirm(
        `⚠️ DANGER: Are you sure you want to permanently DELETE ${user.firstName} ${user.lastName}?\n\nThis action cannot be undone and will remove all user data including:\n- Profile information\n- Calculation history\n- Food diary entries\n\nType "DELETE" to confirm this action.`
      )
    ) {
      return;
    }

    // Double confirmation for delete
    const confirmation = window.prompt(
      'Type "DELETE" to confirm user deletion:'
    );
    if (confirmation !== "DELETE") {
      showMessage("User deletion cancelled", "warning");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showMessage("User deleted successfully", "success");
        setTimeout(() => onClose(), 1500); // Close modal after success
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      showMessage("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  const bmiData = {
    date: "June 7, 2025 03:01:16 PM",
    result: "24.22 kg/m²",
    weight: "70 kg",
    height: "1.7 m",
    formula: "BMI calculated using weight in kg and height in m",
  };

  const foodDiary = [
    {
      date: "July 20, 2025",
      time: "08:15 AM",
      food: "Oatmeal with banana and nuts",
      quantity: "1 bowl",
      note: "Felt light and energized after meal",
    },
    {
      date: "July 20, 2025",
      time: "01:00 PM",
      food: "Grilled chicken with mixed veggies",
      quantity: "1 plate",
      note: "Very filling and satisfying",
    },
    {
      date: "July 20, 2025",
      time: "07:30 PM",
      food: "Avocado toast with eggs",
      quantity: "2 slices",
      note: "Simple and delicious evening meal",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6 relative">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-600 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
              message.includes("success") ||
              message.includes("activated") ||
              message.includes("suspended")
                ? "bg-green-100 text-green-700 border border-green-200"
                : message.includes("warning") || message.includes("cancelled")
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {getRoleName(user.category)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Google ID:</strong> {user.googleId || "N/A"}
                </p>
                <p>
                  <strong>Credits:</strong> {user.credits} points
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {user.verified ? (
                    <span className="text-green-600 font-medium">
                      ✅ Active
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ❌ Suspended
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Last Active:</strong>{" "}
                  {user.lastUsageDate || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* BMI Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Latest BMI Result
            </h3>
            <div className="bg-green-50 p-4 rounded-lg space-y-1 text-sm">
              <p>
                <strong>Date & Time:</strong> {bmiData.date}
              </p>
              <p>
                <strong>Result:</strong> {bmiData.result}
              </p>
              <p>
                <strong>Weight:</strong> {bmiData.weight}
              </p>
              <p>
                <strong>Height:</strong> {bmiData.height}
              </p>
              <p className="text-xs italic text-gray-600">{bmiData.formula}</p>
            </div>
          </div>

          {/* Food Diary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Recent Food Diary
            </h3>
            <div className="space-y-3">
              {foodDiary.map((entry, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg text-sm">
                  <p>
                    <strong>Date:</strong> {entry.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {entry.time}
                  </p>
                  <p>
                    <strong>Food Eaten:</strong> {entry.food}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {entry.quantity}
                  </p>
                  <p>
                    <strong>Meal Experience:</strong> {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone - Only show if user has access */}
          {canAccessDangerZone && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-red-700 border-b pb-2">
                  User Management
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handleSuspendUser}
                  disabled={loading || !user.verified}
                  className={`py-2 rounded text-sm font-medium transition-colors ${
                    !user.verified
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {loading ? "Processing..." : "Suspend User"}
                </button>
                <button
                  onClick={handleActivateUser}
                  disabled={loading || user.verified}
                  className={`py-2 rounded text-sm font-medium transition-colors ${
                    user.verified
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Processing..." : "Activate User"}
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loading || !isSuperAdmin}
                  className={`py-2 rounded text-sm font-medium transition-colors ${
                    !isSuperAdmin
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
                      : "border border-red-600 text-red-600 hover:bg-red-100"
                  }`}
                  title={
                    !isSuperAdmin ? "Only Super Admins can delete users" : ""
                  }
                >
                  {loading ? "Processing..." : "Delete User"}
                </button>
              </div>
              {!isSuperAdmin && (
                <p className="text-xs text-gray-600 text-center mt-2">
                  * User deletion requires Super Admin privileges
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
