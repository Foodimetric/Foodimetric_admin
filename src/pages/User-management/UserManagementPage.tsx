import { useState, useMemo, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { Table } from "./components/Table";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { FileDown, UserRoundX } from "lucide-react";

export const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { analytics, loading, error, refetch } = useAnalytics();

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  useEffect(() => {
    refetch()
  },[])

  // Transform analytics data to User format
  const userData = useMemo(() => {
    if (!analytics?.allUsers) return [];

    return analytics.allUsers.map((user: any) => ({
      id: String(user._id), // Ensure ID is a string
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
    }));
  }, [analytics]);

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

  const filteredUsers = useMemo(() => {
    return userData.filter((user) =>
      [user.firstName, user.lastName, user.email]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [userData, searchTerm]);

  const exportCSV = (users: typeof filteredUsers) => {
    if (users.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = [
      "Email,First Name,Last Name,Usage,Role,Google ID,Credits,Last Usage Date,Verified",
    ];

    const rows = users.map((user) => {
      const escapeCSV = (value: string | number | null | undefined) => {
        const str = String(value || "");
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      };

      return [
        escapeCSV(user.email),
        escapeCSV(user.firstName),
        escapeCSV(user.lastName),
        escapeCSV(user.usage),
        escapeCSV(getRole(user.category)),
        escapeCSV(user.googleId || "N/A"),
        escapeCSV(user.credits),
        escapeCSV(user.lastUsageDate),
        user.verified ? "Yes" : "No",
      ].join(",");
    });

    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User & Account Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage user accounts, view usage statistics, and adjust credits
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => exportCSV(filteredUsers)}
                disabled={filteredUsers.length === 0 || filteredUsers.length !== userData.length || loading}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FileDown className="-4 h-4"/>
                Export CSV
              </button>
              <div className="text-lg font-bold px-3 py-2 bg-gray-100 rounded-md">
                {loading ? "Loading..." : `${filteredUsers.length} users`}
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <SearchBar
            placeholder="Search users by name or email..."
            onSearch={handleSearch}
          />
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              {filteredUsers.length > 0
                ? `Found ${filteredUsers.length} user${
                    filteredUsers.length !== 1 ? "s" : ""
                  } matching "${searchTerm}"`
                : `No users found matching "${searchTerm}"`}
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 bg-gray-200 animate-pulse rounded-md"
                  ></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">Error loading user data: {error}</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserRoundX className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `Try adjusting your search criteria or clearing the search term.`
                  : "No user data is currently available."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table
                data={filteredUsers}
                searchTerm={searchTerm}
                loading={loading}
                error={error}
              />
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredUsers.length} of {userData.length} total users
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  );
};
