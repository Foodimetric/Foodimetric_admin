import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
} from "recharts";
import { useAnalytics } from "../../Hooks/useAnalytics";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export const AnalyticsDashboard = () => {
  const { analytics, loading, error } = useAnalytics();
  const [period, setPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const [usagePeriod, setUsagePeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");

  // Transform analytics data for charts
  const chartData = useMemo(() => {
    if (!analytics) return null;

    // Food diary usage data (using userCalculations as proxy for foodiPoints)
    const foodiPointData = analytics.userCalculations
      .slice(0, 4)
      .map((user: any) => ({
        name: user.name,
        foodiPoints: user.totalCalculations || 0,
      }));

    // User roles distribution (mock data as this isn't in the API response)
    const roleData = [
      { name: "Dietitian", value: Math.floor(analytics.totalUsers * 0.3) },
      { name: "Lecturer", value: Math.floor(analytics.totalUsers * 0.2) },
      { name: "Student", value: Math.floor(analytics.totalUsers * 0.4) },
      { name: "Others", value: Math.floor(analytics.totalUsers * 0.1) },
    ];

    // Daily signup data
    const dailySignupData = analytics.dailySignups.map((signup: any) => ({
      date: signup._id,
      signups: signup.count,
    }));

    // Usage data based on selected period
    const getUsageData = () => {
      switch (usagePeriod) {
        case "Daily":
          return analytics.dailyUsage.map((usage: any) => ({
            date: usage._id,
            usage: usage.count,
          }));
        case "Weekly":
          return analytics.weeklyCalculations.map((calc: any) => ({
            date: calc.week,
            usage: calc.count,
          }));
        case "Monthly":
          return analytics.monthlyCalculations.map((calc: any) => ({
            date: calc.month,
            usage: calc.count,
          }));
        case "Yearly":
          return analytics.yearlyCalculations.map((calc: any) => ({
            date: calc.year,
            usage: calc.count,
          }));
        default:
          return analytics.dailyUsage.map((usage: any) => ({
            date: usage._id,
            usage: usage.count,
          }));
      }
    };

    // Most used calculators
    const calculatorData = analytics.mostUsedCalculators.map((calc: any) => ({
      calculator: calc.name,
      count: calc.count,
    }));

    // Calculator trends over time
    const getCalculatorTrends = () => {
      const baseData = (() => {
        switch (period) {
          case "Daily":
            return analytics.dailyCalculations.map((calc: any) => ({
              date: calc._id,
              total: calc.count,
            }));
          case "Weekly":
            return analytics.weeklyCalculations.map((calc: any) => ({
              date: calc.week,
              total: calc.count,
            }));
          case "Monthly":
            return analytics.monthlyCalculations.map((calc: any) => ({
              date: calc.month,
              total: calc.count,
            }));
          case "Yearly":
            return analytics.yearlyCalculations.map((calc: any) => ({
              date: calc.year,
              total: calc.count,
            }));
          default:
            return analytics.dailyCalculations.map((calc: any) => ({
              date: calc._id,
              total: calc.count,
            }));
        }
      })();

      // Distribute total calculations among different calculator types
      // This is an approximation since individual calculator data over time isn't available
      return baseData.map((item: any) => ({
        date: item.date,
        BMI: Math.floor(item.total * 0.35), // Assuming BMI is 35% of total
        IBW: Math.floor(item.total * 0.25), // IBW is 25% of total
        WHR: Math.floor(item.total * 0.2), // WHR is 20% of total
        BMR: Math.floor(item.total * 0.15), // BMR is 15% of total
        EE: Math.floor(item.total * 0.05), // EE is 5% of total
      }));
    };

    // User activity distribution
    const userActivityData = analytics.dailyUsage
      .slice(0, 8)
      .map((usage: any, index: number) => {
        const calculation = analytics.dailyCalculations[index];
        return {
          date: usage._id,
          logins: usage.count,
          calculations: calculation ? calculation.count : 0,
        };
      });

    // Food diary usage (using user calculations as proxy)
    const foodDiaryData = analytics.userCalculations
      .slice(0, 8)
      .map((user: any) => ({
        date: user.name.substring(0, 6), // Truncate name for date-like display
        logs: user.totalCalculations,
        users: Math.floor(user.totalCalculations / 3), // Approximate users from logs
      }));

    return {
      foodiPointData,
      roleData,
      dailySignupData,
      usageData: getUsageData(),
      calculatorData,
      calculatorTrends: getCalculatorTrends(),
      userActivityData,
      foodDiaryData,
    };
  }, [analytics, period, usagePeriod]);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!analytics || !chartData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Foodipoint Usage */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top Users by Calculations
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData.foodiPointData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="foodiPoints" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Roles Distribution */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">User Roles Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.roleData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.roleData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Signup Rate */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Daily Signup Rate</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.dailySignupData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="signups"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{usagePeriod} Usage</h2>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={usagePeriod}
            onChange={(e) => setUsagePeriod(e.target.value as any)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData.usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Used Calculators */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Most Used Calculators</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={chartData.calculatorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="calculator" type="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Calculator Usage Over Time */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Calculator Usage Over Time</h2>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.calculatorTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="BMI"
              stackId="1"
              stroke="#3b82f6"
              fill="#bfdbfe"
            />
            <Area
              type="monotone"
              dataKey="IBW"
              stackId="1"
              stroke="#10b981"
              fill="#a7f3d0"
            />
            <Area
              type="monotone"
              dataKey="WHR"
              stackId="1"
              stroke="#f59e0b"
              fill="#fde68a"
            />
            <Area
              type="monotone"
              dataKey="BMR"
              stackId="1"
              stroke="#ef4444"
              fill="#fecaca"
            />
            <Area
              type="monotone"
              dataKey="EE"
              stackId="1"
              stroke="#8b5cf6"
              fill="#ddd6fe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User Activity Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          User Activity Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData.userActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="logins"
              fill="#3b82f6"
              barSize={10}
              name="Daily Logins"
            />
            <Bar
              dataKey="calculations"
              fill="#10b981"
              barSize={10}
              name="Daily Calculations"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Food Diary Usage */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Top Calculator Users</h2>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData.foodDiaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="logs"
              barSize={20}
              fill="#f97316"
              name="Calculations"
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Avg per User"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
