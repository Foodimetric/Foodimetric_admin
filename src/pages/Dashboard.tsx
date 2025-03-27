import { useEffect, useMemo, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { FOODIMETRIC_HOST_URL } from "../utils";
import { Column, useTable, usePagination } from "react-table";

Chart.register(...registerables);

type UserData = {
  category: number;
  usage: number;
  googleId: string;
  lastUsageDate: string | null;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
};

type AnalyticsData = {
  allUsers: UserData[];
  dailyCalculations: { _id: string; count: number }[];
  weeklyCalculations: { _id: string; count: number }[];
  monthlyCalculations: { _id: string; count: number }[];
  yearlyCalculations: { _id: string; count: number }[];
  dailyUsage: { _id: string; count: number }[];
  mostUsedCalculators: { name: string; count: number; trend: number }[];
  topUsers: { id: string; name: string; usageCount: number; lastUsed: string }[];
  anthropometricStats: { weekly: number };
  totalFoodDiaryLogs: number;
  weeklyFoodDiaryLogs: number;
  monthlyFoodDiaryLogs: number;
  yearlyFoodDiaryLogs: number;
  totalUsers: number;
  totalAnthropometricCalculations: number;
};
const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const columns = useMemo<Column<UserData>[]>( // Explicit type declaration
    () => [
      { Header: "Email", accessor: "email" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Usage", accessor: "usage" },
      { Header: "Category", accessor: "category" },
      { Header: "Google ID", accessor: "googleId" },


      {
        Header: "Last Usage Date",
        accessor: "lastUsageDate",
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
      },
      {
        Header: "Verified",
        accessor: "isVerified",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
    ],
    []
  );

  const data = useMemo(() => {
    if (!analytics) {
      return [];
    }
    return analytics.allUsers;
  }, [analytics]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Use 'page' instead of 'rows'
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 }, // Initial page and page size
    },
    usePagination
  );


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(
          `${FOODIMETRIC_HOST_URL}/admin/dashboard/analytics`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch analytics");

        const data: AnalyticsData = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!analytics)
    return <div className="text-center mt-10 text-gray-400">No data available</div>;

  const calculationsData = {
    labels: analytics.dailyCalculations.map((entry) => entry._id),
    datasets: [
      {
        label: "Daily Calculations",
        data: analytics.dailyCalculations.map((entry) => entry.count),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Weekly Calculations",
        data: analytics?.weeklyCalculations?.map((entry) => entry?.count),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Monthly Calculations",
        data: analytics.monthlyCalculations.map((entry) => entry.count),
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Yearly Calculations",
        data: analytics.yearlyCalculations.map((entry) => entry.count),
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const dailyUsageData = {
    labels: analytics.dailyUsage.map((entry) => entry._id),
    datasets: [
      {
        label: "Daily Usage",
        data: analytics.dailyUsage.map((entry) => entry.count),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const calculatorUsageData = {
    labels: analytics.mostUsedCalculators.map((calc) => calc.name),
    datasets: [
      {
        label: "Usage Count",
        data: analytics.mostUsedCalculators.map((calc) => calc.count),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  const topUsersData = {
    labels: analytics.topUsers.map((user) => user.name),
    datasets: [
      {
        label: "Usage Count",
        data: analytics.topUsers.map((user) => user.usageCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8BC34A",
          "#E91E63",
          "#00BCD4",
          "#FFEB3B",
        ],
        hoverBackgroundColor: [
          "#FF4365",
          "#2592DB",
          "#E5B944",
          "#3AAFA9",
          "#7D5FFF",
          "#FF7800",
          "#6EA036",
          "#C21858",
          "#008BA3",
          "#D4C700",
        ],
      },
    ],
  };

  const userActivityData = {
    labels: analytics.dailyUsage.map((entry) => entry._id),
    datasets: [
      {
        label: "Daily Logins",
        data: analytics.dailyUsage.map((entry) => entry.count),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "#6366F1",
        borderWidth: 1,
      },
      {
        label: "Daily Calculations",
        data: analytics.dailyCalculations.map((entry) => entry.count),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };

  const foodDiaryLogsData = {
    labels: ["Weekly", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Food Diary Logs",
        data: [
          analytics.weeklyFoodDiaryLogs,
          analytics.monthlyFoodDiaryLogs,
          analytics.yearlyFoodDiaryLogs,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF4365", "#2592DB", "#E5B944"],
        borderWidth: 1,
      },
    ],
  };

  const calculatorTrendsData = {
    labels: analytics.mostUsedCalculators.map((calc) => calc.name),
    datasets: [
      {
        label: "Calculator Usage Trend",
        data: analytics.mostUsedCalculators.map((calc) => calc.trend),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Anthropometric Stats (Weekly)</h3>
          <p className="text-2xl font-bold">{analytics.anthropometricStats.weekly}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Food Diary Logs</h3>
          <p className="text-2xl font-bold">{analytics.totalFoodDiaryLogs}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{analytics.totalUsers}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Anthropometric</h3>
          <p className="text-2xl font-bold">{analytics.totalAnthropometricCalculations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Daily Calculations Usage</h2>
          <Line data={calculationsData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
          <Line data={dailyUsageData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Most Used Calculators</h2>
          <Bar data={calculatorUsageData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Top Users</h2>
          <Pie data={topUsersData} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">User Activity Distribution</h2>
          <Bar data={userActivityData} />
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Food Diary Logs Comparison</h2>
          <Bar data={foodDiaryLogsData} />
        </div>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Rank</th>
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Usage Count</th>
              <th className="border border-gray-300 p-2">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topUsers.map((user, index) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.usageCount}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(user.lastUsed).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full border-collapse border border-gray-300"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="border border-gray-300 p-2"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => { // Use 'page' instead of 'rows'
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="text-center">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="border border-gray-300 p-2">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>
            <span className="ml-2">
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded p-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Calculator Usage Trends</h2>
          <Line data={calculatorTrendsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;