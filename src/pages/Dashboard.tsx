import { useEffect, useMemo, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { FOODIMETRIC_HOST_URL } from "../utils";
import {
  Column,
  useTable,
  usePagination,
  useSortBy,
  UseTableInstanceProps,
  // @ts-expect-error: 'Table' is not exported directly but needed for typing
  Table,
  Row,
} from "react-table";

Chart.register(...registerables);

// Explicitly define the 'week' and 'month' properties in the calculation types
type DailyCalculation = { _id: string; count: number };
type WeeklyCalculation = DailyCalculation & { week: string };
type MonthlyCalculation = DailyCalculation & { month: string };
type YearlyCalculation = DailyCalculation & { year: string };
type DailyUsage = { _id: string; count: number };
type DailySignup = { _id: string; count: number };

type UserCalculation = {
  name: string;
  calculations: { date: string; count: number }[];
  totalCalculations: number; // Added totalCalculations type
  id: string; // Assuming 'id' exists in userCalculations
};

type MostUsedCalculator = { name: string; count: number; trend: number };
type TopUser = { id: string; name: string; usageCount: number; lastUsed: string };
type AnthropometricStats = { weekly: number };

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
  userCalculations: UserCalculation[]; // Updated type
  allUsers: UserData[];
  dailyCalculations: DailyCalculation[];
  weeklyCalculations: WeeklyCalculation[]; // Updated type
  monthlyCalculations: MonthlyCalculation[]; // Updated type
  yearlyCalculations: YearlyCalculation[]; // Updated type
  dailyUsage: DailyUsage[];
  dailySignups: DailySignup[]; // Assuming this exists in your backend response
  mostUsedCalculators: MostUsedCalculator[];
  topUsers: TopUser[];
  anthropometricStats: AnthropometricStats;
  totalFoodDiaryLogs: number;
  weeklyFoodDiaryLogs: number;
  monthlyFoodDiaryLogs: number;
  yearlyFoodDiaryLogs: number;
  totalUsers: number;
  totalAnthropometricCalculations: number;
  newsletterSubscribers?: { email: string }[];
};

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedRange, setSelectedRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const columns = useMemo<Column<UserData>[]>(
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

  const data = useMemo(() => analytics?.allUsers ?? [], [analytics]);

  const chartData = useMemo(() => {
    if (!analytics) return { labels: [], datasets: [] };

    const labels = analytics.userCalculations.flatMap((user) =>
      user.calculations.map((c) => c.date)
    );
    const datasets = analytics.userCalculations.map((user) => ({
      label: user.name,
      data: user.calculations.map((c) => c.count),
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
    }));

    return { labels, datasets };
  }, [analytics]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<UserData>(
    {
      columns,
      data,
      // @ts-expect-error: 'Table' is not exported directly but needed for typing
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useSortBy,
    usePagination
  ) as UseTableInstanceProps<UserData> & Table<UserData>; // Explicitly cast the return type

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
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

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch analytics:", errorData);
          throw new Error(`Failed to fetch analytics: ${response.status}`);
        }

        const data = (await response.json()) as AnalyticsData;
        console.log("data", data);
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

  const dailyData = {
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
    ],
  };

  const weeklyData = {
    labels: analytics.weeklyCalculations.map((entry) => entry.week),
    datasets: [
      {
        label: "Weekly Calculations",
        data: analytics.weeklyCalculations.map((entry) => entry.count),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const monthlyData = {
    labels: analytics.monthlyCalculations.map((entry) => entry.month),
    datasets: [
      {
        label: "Monthly Calculations",
        data: analytics.monthlyCalculations.map((entry) => entry.count),
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const yearlyData = {
    labels: analytics.yearlyCalculations.map((entry) => entry.year),
    datasets: [
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

  const dailySignupData = {
    labels: analytics.dailySignups.map((entry) => entry._id),
    datasets: [
      {
        label: "Daily Signup",
        data: analytics.dailySignups.map((entry) => entry.count),
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

  const dateSet = new Set([
    ...(analytics.dailyUsage?.map((entry) => entry._id) ?? []),
    ...(analytics.dailyCalculations?.map((entry) => entry._id) ?? []),
  ]);
  const allDates = Array.from(dateSet).sort();

  const usageMap = new Map(analytics.dailyUsage?.map((entry) => [entry._id, entry.count]));
  const calcMap = new Map(analytics.dailyCalculations?.map((entry) => [entry._id, entry.count]));

  const userActivityData = {
    labels: allDates,
    datasets: [
      {
        label: "Daily Logins",
        data: allDates.map((date) => usageMap.get(date) || 0),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "#6366F1",
        borderWidth: 1,
      },
      {
        label: "Daily Calculations",
        data: allDates.map((date) => calcMap.get(date) || 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "#FF6384",
        borderWidth: 1,
      },
    ],
  };

  const periodicData = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
    yearly: yearlyData,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const }, // Explicitly type 'position'
      title: { display: true, text: `Calculator Usage - ${selectedRange}` },
    },
  };

  const downloadCSV = () => {
    if (!analytics) return;
    console.log('newsletter', analytics.newsletterSubscribers);

    const newsletterData = (analytics.newsletterSubscribers || []).map((sub) => ({
      email: sub.email,
      firstName: 'guest',
      lastName: 'guest',
      usage: 0,
      category: 0,
      googleId: 'guest',
      lastUsageDate: null,
      isVerified: false,
    }));

    const mergedData = [...analytics.allUsers, ...newsletterData];
    console.log('merged', mergedData);

    const headers = [
      "Email",
      "First Name",
      "Last Name",
      "Usage",
      "Category",
      "Google ID",
      "Last Usage Date",
      "Verified",
    ];

    const csvRows = [
      headers.join(","),
      ...mergedData.map((user) => {
        const formattedDate = user.lastUsageDate
          ? `="${new Date(user.lastUsageDate).toISOString().split("T")[0]}"`
          : "N/A";

        return [
          user.email,
          user.firstName,
          user.lastName,
          user.usage,
          user.category,
          `="${user.googleId}"`,
          formattedDate,
          user.isVerified ? "Yes" : "No",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",");
      }),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "all_users.csv";
    document.body.appendChild(link); // Append to the document so click() works in all browsers
    link.click();
    document.body.removeChild(link); // Clean up

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Anthropometric Stats (Weekly)</h3>
          <p className="text-2xl font-bold">{analytics?.anthropometricStats?.weekly}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Food Diary Logs</h3>
          <p className="text-2xl font-bold">{analytics?.totalFoodDiaryLogs}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{analytics?.totalUsers}</p>
        </div>
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Anthropometric</h3>
          <p className="text-2xl font-bold">{analytics?.totalAnthropometricCalculations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Daily Signup Rate</h2>
          {analytics?.dailySignups && <Line data={dailySignupData} />}
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
          {analytics?.dailyUsage && <Line data={dailyUsageData} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Most Used Calculators</h2>
          {analytics?.mostUsedCalculators && <Bar data={calculatorUsageData} />}
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Calculator Usage Over Time</h2>
          <div className="flex justify-end">
            <select
              title="Select Range"
              className="select select-bordered bg-white"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {periodicData[selectedRange]?.labels?.length > 0 && (
            <Line data={periodicData[selectedRange]} options={options} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">User Activity Distribution</h2>
          {userActivityData?.labels?.length > 0 && <Bar data={userActivityData} />}
        </div>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Food Diary Usage</h2>
          {chartData?.labels?.length > 0 && <div> <Bar data={chartData} /></div>}
        </div>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
        {analytics?.topUsers?.length > 0 ? (
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
                    {user.lastUsed ? new Date(user.lastUsed).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No top users data available.</p>
        )}
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">All Users</h2>
        <button
          onClick={downloadCSV}
          className="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-100 text-sm mb-4"
        >
          Export CSV
        </button>
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full border-collapse border border-gray-300"
          >
            <thead>
              {headerGroups.map((headerGroup: any) => {
                const headerGroupProps = headerGroup.getHeaderGroupProps();
                return (
                  <tr key={headerGroup.id} {...headerGroupProps} className="bg-gray-200">
                    {headerGroup.headers.map((column: any) => {
                      const columnHeaderProps = column.getHeaderProps(column.getSortByToggleProps());
                      return (
                        <th
                          key={column.id} // Adding a unique key here
                          {...columnHeaderProps} // Spread remaining props
                          className="border border-gray-300 p-2 cursor-pointer select-none hover:bg-gray-100"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row: Row<UserData>) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="text-center">
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      return (
                        <td {...cellProps} className="border border-gray-300 p-2">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* First Page */}
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className={`px-3 py-1 rounded border ${canPreviousPage ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              First
            </button>

            {/* Previous Page */}
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`px-3 py-1 rounded border ${canPreviousPage ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              Previous
            </button>

            {/* Page Number Indicator */}
            <span className="text-sm">
              Page {pageIndex + 1} of {pageOptions.length}
            </span>

            {/* Next Page */}
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`px-3 py-1 rounded border ${canNextPage ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>

            {/* Last Page */}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={`px-3 py-1 rounded border ${canNextPage ? "border-blue-500 text-blue-500 hover:bg-blue-100" : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              Last
            </button>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSizeSelect" className="text-sm">
              Items per page:
            </label>
            <select
              id="pageSizeSelect"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 rounded p-1 text-sm bg-white" // Added bg-white for better contrast
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Top Anthropometric Users</h2>
        {analytics?.userCalculations?.length > 0 ? (
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
              {analytics.userCalculations.map((user, index) => {
                const lastActiveTime = Math.max(...(user.calculations?.map(calc => new Date(calc.date).getTime()) || [0]));
                const lastActive = lastActiveTime > 0 ? new Date(lastActiveTime).toLocaleDateString() : "N/A";

                return (
                  <tr key={`${user.id}-${index}`} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{user.name}</td>
                    <td className="border border-gray-300 p-2">{user.totalCalculations}</td>
                    <td className="border border-gray-300 p-2">{lastActive}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No anthropometric user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;