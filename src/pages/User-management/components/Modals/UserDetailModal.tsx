import { User } from "../../types/user";
import {
  X,
  User as UserIcon,
  Heart,
  Bell,
  Smartphone,
  Trophy,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useAnalytics } from "../../../../contexts/AnalyticsContext";
import { FOODIMETRIC_HOST_URL } from "../../../../utils";

interface Props {
  user: User;
  onClose: () => void;
}

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

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "-";
  }
};

const formatFCMToken = (token: string) => {
  if (!token || token.length < 10) return token;
  return `${token.substring(0, 6)}...${token.substring(token.length - 4)}`;
};

export const UserDetailModal = ({ user: initialUser, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { analytics, refetch } = useAnalytics();

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
        usage: analyticsUser.usage,
        location: analyticsUser.location,
        healthProfile: analyticsUser.healthProfile,
        longestStreak: analyticsUser.longestStreak,
        streak: analyticsUser.streak,
        status: analyticsUser.status,
        fcmTokens: analyticsUser.fcmTokens,
        notifications: analyticsUser.notifications,
        partner: analyticsUser.partner,
        partnerDetails: analyticsUser.partnerDetails,
        partnerInvites: analyticsUser.partnerInvites,
        latestCalculation: analyticsUser.latestCalculation,
        latestFoodLogs: analyticsUser.latestFoodLogs,
      }
    : initialUser;

  // Get current user role from localStorage
  const currentUserRole = localStorage.getItem("userRole");
  const isSuperAdmin = currentUserRole === "super_admin";
  const isAdmin = currentUserRole === "admin";
  // const isMarketing = currentUserRole === "marketing";
  // const isDeveloper = currentUserRole === "developer";
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
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/users/${user.id}/suspend`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showMessage("User suspended successfully", "success");
        await refetch();
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
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/users/${user.id}/activate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showMessage("User activated successfully", "success");
        await refetch();
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
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showMessage("User deleted successfully", "success");
        await refetch();
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      showMessage("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-blue-100">{getRoleName(user.category)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.verified
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {user.verified ? "Verified" : "Unverified"}
            </div>
            {user.status && (
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Status:{" "}
                {user.status === "active" ? "Active ✅" : "Suspended ❌"}
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mx-6 mt-4 p-4 rounded-xl text-sm font-medium ${
              message.includes("success") ||
              message.includes("activated") ||
              message.includes("suspended")
                ? "bg-green-50 text-green-700 border-l-4 border-green-400"
                : message.includes("warning") || message.includes("cancelled")
                ? "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400"
                : "bg-red-50 text-red-700 border-l-4 border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2">
                <Trophy className="text-blue-600" size={20} />
                <div>
                  <p className="text-blue-900 font-semibold">
                    {user.credits || 0}
                  </p>
                  <p className="text-blue-700 text-xs">Credits</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2">
                <Calendar className="text-green-600" size={20} />
                <div>
                  <p className="text-green-900 font-semibold">
                    {user.usage || 0}
                  </p>
                  <p className="text-green-700 text-xs">Usage Count</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🔥</span>
                </div>
                <div>
                  <p className="text-orange-900 font-semibold">
                    {user.streak || 0}
                  </p>
                  <p className="text-orange-700 text-xs">Current Streak</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-2">
                <Trophy className="text-purple-600" size={20} />
                <div>
                  <p className="text-purple-900 font-semibold">
                    {user.longestStreak || 0}
                  </p>
                  <p className="text-purple-700 text-xs">Best Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserIcon className="mr-2 text-indigo-600" size={24} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="text-gray-900">{user.location || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Google ID:</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {user.googleId || "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Last Active:
                  </span>
                  <span className="text-gray-900 text-sm">
                    {formatDate(user.lastUsageDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Details */}
          {user.partnerDetails && (
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="mr-2 text-pink-600" size={24} />
                Partner Information
              </h3>
              <div className="flex items-center justify-between bg-white/50 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.partnerDetails.firstName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {user.partnerDetails.email}
                  </p>
                </div>
                <div className="text-pink-500">
                  <Heart size={24} fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          {/* Health Profile */}
          {user.healthProfile && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Health Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-700">
                    {user.healthProfile.age || "-"}
                  </p>
                  <p className="text-emerald-600 text-sm">Age (years)</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    {user.healthProfile.height || "-"}
                  </p>
                  <p className="text-teal-600 text-sm">Height (cm)</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-cyan-700">
                    {user.healthProfile.weight || "-"}
                  </p>
                  <p className="text-cyan-600 text-sm">Weight (kg)</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">
                    {user.healthProfile.bmi || "-"}
                  </p>
                  <p className="text-blue-600 text-sm">BMI</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="font-medium text-gray-700 mb-2">
                    Additional Metrics
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>BMR:</span>
                      <span className="font-medium">
                        {user.healthProfile.bmr || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>WHR:</span>
                      <span className="font-medium">
                        {user.healthProfile.whr || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sex:</span>
                      <span className="font-medium capitalize">
                        {user.healthProfile.sex || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eating Habit:</span>
                      <span className="font-medium">
                        {user.healthProfile.eatingHabit || "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {user.healthProfile.conditions &&
                    user.healthProfile.conditions.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="font-medium text-red-800 mb-2">
                          Health Conditions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.healthProfile.conditions.map(
                            (condition: string, index: number) => (
                              <span
                                key={index}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                              >
                                {condition}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {user.healthProfile.goals &&
                    user.healthProfile.goals.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="font-medium text-green-800 mb-2">
                          Health Goals
                        </p>
                        <div className="space-y-1">
                          {user.healthProfile.goals.map(
                            (goal: string, index: number) => (
                              <p key={index} className="text-green-700 text-sm">
                                • {goal}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {user.healthProfile.preferences &&
                    user.healthProfile.preferences.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="font-medium text-purple-800 mb-2">
                          Dietary Preferences
                        </p>
                        <div className="space-y-1">
                          {user.healthProfile.preferences.map(
                            (preference: string, index: number) => (
                              <p
                                key={index}
                                className="text-purple-700 text-sm"
                              >
                                • {preference}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Latest Food Logs */}
          {user.latestFoodLogs && user.latestFoodLogs.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Recent Food Logs
              </h3>
              <div className="space-y-4">
                {user.latestFoodLogs.map((log: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/70 rounded-lg p-4 border border-amber-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {log.foodEaten}
                        </p>
                        <p className="text-amber-700 text-sm">{log.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">
                          {formatDate(log.date)}
                        </p>
                        <p className="text-gray-500 text-xs">{log.time}</p>
                      </div>
                    </div>
                    {log.additionalInfo && (
                      <p className="text-gray-600 text-sm italic bg-amber-50 p-2 rounded">
                        "{log.additionalInfo}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Latest Calculation */}
          {user.latestCalculation && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Latest Calculation
              </h3>
              <div className="bg-white/70 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-indigo-700">
                      {user.latestCalculation.result}
                    </p>
                    <p className="text-indigo-600">
                      {user.latestCalculation.calculator_name}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {formatDate(user.latestCalculation.timestamp)}
                  </p>
                </div>
                {user.latestCalculation.parameters && (
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {Object.entries(user.latestCalculation.parameters).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key}:
                          </span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
                {user.latestCalculation.calculation_details && (
                  <p className="text-gray-600 text-sm italic">
                    {user.latestCalculation.calculation_details}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          {user.notifications && user.notifications.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Bell className="mr-2 text-amber-600" size={24} />
                Recent Notifications ({user.notifications.length})
              </h3>
              <div className="space-y-3">
                {user.notifications
                  .slice(0, 3)
                  .map((notification: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        notification.read
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-amber-300 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {formatDate(notification.createdAt)} •{" "}
                            {notification.type}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* FCM Tokens */}
          {user.fcmTokens && user.fcmTokens.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Smartphone className="mr-2 text-gray-600" size={24} />
                Device Tokens ({user.fcmTokens.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.fcmTokens.map((token: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white/70 p-3 rounded-lg border border-gray-300"
                  >
                    <p className="font-mono text-sm text-gray-700">
                      {formatFCMToken(token)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {canAccessDangerZone && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-700">
                  User Management
                </h3>
                <span className="text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleSuspendUser}
                  disabled={loading || user.status === "suspended"}
                  className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    user.status === "suspended"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                  }`}
                >
                  {loading ? "Processing..." : "Suspend User"}
                </button>
                <button
                  onClick={handleActivateUser}
                  disabled={loading || user.status === "active"}
                  className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    user.status === "active"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                  }`}
                >
                  {loading ? "Processing..." : "Activate User"}
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    !isSuperAdmin
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
                      : "border-2 border-red-600 text-red-600 hover:bg-red-50 shadow-lg cursor-pointer"
                  }`}
                  title={
                    !isSuperAdmin
                      ? "Only Super Admins can delete users"
                      : ""
                  }
                >
                  {loading ? "Processing..." : "Delete User"}
                </button>
              </div>
              {!isSuperAdmin && (
                <p className="text-xs text-red-600 text-center mt-3 bg-red-100 p-2 rounded-lg">
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
