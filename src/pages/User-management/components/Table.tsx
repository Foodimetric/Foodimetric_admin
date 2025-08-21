import { useState, useEffect } from "react";
import { CreditAdjustModal } from "./Modals/CreditAdjustModal";
import { User } from "../types/user";
import { UserDetailModal } from "./Modals/UserDetailModal";
import { UserOptionsMenu } from "./UserOptionsMenu";
import { useAnalytics } from "../../../contexts/AnalyticsContext";

const ITEMS_PER_PAGE = 10;

interface TableProps {
  data?: User[];
  searchTerm?: string;
  loading?: boolean;
  error?: string;
}

export const Table = ({
  data: propData,
  searchTerm = "",
  loading: propLoading,
  error: propError,
}: TableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Use analytics hook when no prop data is provided
  const { analytics, loading: hookLoading, error: hookError } = useAnalytics();

  // Use prop values if provided, otherwise use hook values
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError !== undefined ? propError : hookError;

  // Use prop data if provided, otherwise transform analytics data
  const data: User[] =
    propData ||
    analytics?.allUsers?.map((user: any) => ({
      id: String(user._id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      usage: user.usage,
      category: user.category,
      googleId: user.googleId,
      credits: user.credits,
      lastUsageDate: user.lastUsageDate
        ? new Date(user.lastUsageDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown",
      verified: user.isVerified,
      longestStreak: user.longestStreak,
      location: user.location,
      streak: user.streak,
      healthProfile: user.healthProfile,
      latestCalculation: user.latestCalculation,
      partnerDetails: user.partnerDetails,
      status: user.status,
      latestFoodLogs: user.latestFoodLogs,
      notifications: user.notifications,
      fcmTokens: user.fcmTokens,
    })) ||
    [];

  // Filter data based on search term
  const filteredData = data.filter((user) =>
    searchTerm === ""
      ? true
      : [user.firstName, user.lastName, user.email]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getRole = (category: number) => {
    switch (category) {
      case 1:
        return "Lecturer/Researcher";
      case 2:
        return "Dietitian/Clinical Nutritionist";
      case 3:
        return "Nutrition Student";
      default:
        return "Others";
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (!propData && loading) {
    return (
      <div className="p-4">
        <div className="min-w-full bg-white rounded-md shadow">
          <div className="animate-pulse">
            <div className="bg-gray-100 p-3">
              <div className="grid grid-cols-10 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            {[...Array(ITEMS_PER_PAGE)].map((_, rowIndex) => (
              <div key={rowIndex} className="border-t p-3">
                <div className="grid grid-cols-10 gap-4">
                  {[...Array(10)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-4 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!propData && error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading user data: {error}</p>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            {searchTerm
              ? `No users found matching "${searchTerm}"`
              : "No user data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with user count */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          User Management ({filteredData.length} users
          {searchTerm ? ` matching "${searchTerm}"` : ""})
        </h3>
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1}-
          {Math.min(indexOfLastUser, filteredData.length)} of{" "}
          {filteredData.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">First Name</th>
              <th className="p-3 font-semibold">Last Name</th>
              <th className="p-3 font-semibold">Usage</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Google ID</th>
              <th className="p-3 font-semibold">Credits</th>
              <th className="p-3 font-semibold">Last Usage Date</th>
              <th className="p-3 font-semibold">Verified</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 font-medium text-blue-600">{user.email}</td>
                <td className="p-3 capitalize">{user.firstName}</td>
                <td className="p-3 capitalize">{user.lastName}</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.usage?.toLocaleString()}
                  </span>
                </td>
                <td className="p-3">{getRole(user.category)}</td>
                <td className="p-3 font-mono text-xs">
                  {user.googleId || "N/A"}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.credits > 500
                        ? "bg-green-100 text-green-800"
                        : user.credits > 100
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.credits?.toLocaleString()}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{user.lastUsageDate}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="p-3 z-10">
                  <UserOptionsMenu
                    user={user}
                    isOpen={openMenuId === user.id}
                    onToggle={() => toggleMenu(user.id)}
                    onViewDetails={setViewingUser}
                    onAdjustPoints={setSelectedUser}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2 sm:gap-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof pageNum === "number" && goToPage(pageNum)
                  }
                  disabled={pageNum === "..."}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-t border-b border-r border-gray-300 ${
                    pageNum === currentPage
                      ? "bg-blue-50 text-blue-600 border-blue-500"
                      : pageNum === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-500 bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>

          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} • {filteredData.length} total
            users
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <CreditAdjustModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
};
