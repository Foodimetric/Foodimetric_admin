import { useAnalytics } from "../../../contexts/AnalyticsContext";


const TopUsersTable = () => {
  const { analytics, loading, error, refetch } = useAnalytics();

   const handleRefresh = async () => {
     await refetch();
   };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 animate-pulse">
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
              {[...Array(10)].map((_, rowIndex) => (
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
        <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
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

  if (!analytics || !analytics.topUsers || analytics.topUsers.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
        <p className="text-gray-500">No data available</p>
        <button onClick={handleRefresh}>Load Analytics</button>
      </div>
    );
  }

  const topUsers = analytics.topUsers.map((user: any, index: number) => ({
    rank: index + 1,
    name: user.name || "Unknown User",
    usage: user.usageCount || 0,
    lastActive: user.lastUsed
      ? new Date(user.lastUsed).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Never",
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
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
            {topUsers.map(({ rank, name, usage, lastActive }) => (
              <tr
                key={rank}
                className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
              >
                <td className="border border-gray-200 p-3 text-sm font-medium">
                  #{rank}
                </td>
                <td className="border border-gray-200 p-3 text-sm capitalize font-medium">
                  {name}
                </td>
                <td className="border border-gray-200 p-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

      <div className="mt-4 text-sm text-gray-600">
        Showing top {topUsers.length} users by engagement
      </div>
    </div>
  );
};

export default TopUsersTable;
