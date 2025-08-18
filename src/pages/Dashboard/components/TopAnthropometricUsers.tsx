import { useState } from "react";
import { useAnalytics } from "../../../contexts/AnalyticsContext";

const USERS_PER_PAGE = 10;

const TopAnthropometricUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { analytics, loading, error, refetch } = useAnalytics();

   const handleRefresh = async () => {
     await refetch();
   };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top 30 Anthropometric Users</h2>
          {/* <span className="text-sm text-gray-600">
            Showing top {Math.min(30, rankedUsers.length)} users
          </span> */}
        </div>
        <div className="overflow-x-auto animate-pulse">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[...Array(4)].map((_, index) => (
                  <th
                    key={index}
                    className="border border-gray-200 p-3 text-left text-sm font-medium"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(USERS_PER_PAGE)].map((_, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {[...Array(4)].map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-200 p-3 text-sm"
                    >
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Anthropometric Users</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.userCalculations?.length) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Anthropometric Users</h2>
        <p className="text-gray-500">No data available</p>
        <button onClick={handleRefresh}>Load Analytics</button>
      </div>
    );
  }

  // Fixed: Format API data with proper last active calculation from user calculations
  // Limit to top 30 users only
  const users = analytics.userCalculations
    ?.slice(0, 30)
    .map((user: any, index: number) => {
      // Calculate last active date from user's calculations
      const lastActiveTime =
        user.calculations?.length > 0
          ? Math.max(
              ...user.calculations.map((calc: any) =>
                new Date(calc.date).getTime()
              )
            )
          : null;

      const lastActive = lastActiveTime
        ? new Date(lastActiveTime).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Never";

      return {
        rank: index + 1,
        name: user.name || "Unknown User",
        usage: user.totalCalculations || 0,
        lastActive: lastActive,
      };
    });

  // Sort users by totalCalculations (descending) to show actual top users
  const sortedUsers = users.sort((a: any, b: any) => b.usage - a.usage);

  // Update ranks after sorting
  const rankedUsers = sortedUsers.map((user: any, index: number) => ({
    ...user,
    rank: index + 1,
  }));

  // Pagination logic
  const totalPages = Math.ceil(rankedUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = rankedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Reset to first page if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Top Anthropometric Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Rank
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                User
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Usage Count
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(({ rank, name, usage, lastActive }) => (
              <tr
                key={`${rank}-${name}`}
                className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <td className="border border-gray-200 p-3 text-sm font-medium">
                  #{rank}
                </td>
                <td className="border border-gray-200 p-3 text-sm capitalize font-medium">
                  {name}
                </td>
                <td className="border border-gray-200 p-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {usage.toLocaleString()}
                  </span>
                </td>
                <td className="border border-gray-200 p-3 text-sm text-gray-600">
                  {lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <span>
              Showing {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, rankedUsers.length)} of{" "}
              {rankedUsers.length} users
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopAnthropometricUsers;
