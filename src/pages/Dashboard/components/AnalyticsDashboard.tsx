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
import { useAnalytics } from "../../../contexts/AnalyticsContext";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export const AnalyticsDashboard = () => {
  const { analytics, loading, error, refetch } = useAnalytics();
  const [period, setPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const [usagePeriod, setUsagePeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const [signupPeriod, setSignupPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const [foodDiaryPeriod, setFoodDiaryPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");

  const handleRefresh = async () => {
    await refetch();
  };

  const chartData = useMemo(() => {
    if (!analytics) return null;

    // const topUsersData = analytics.userCalculations
    //   .slice(0, 4)
    //   .map((user: any) => ({
    //     name: user.name,
    //     calculations: user.totalCalculations || 0,
    //   }));
    console.log(analytics.foodDiaryStats);

    const getFoodDiaryStats = () => {
      switch (foodDiaryPeriod) {
        case "Daily":
          return analytics.foodDiaryStats.daily.map((diary: any) => ({
            date: diary._id,
            count: diary.count,
          }));
        case "Weekly":
          return analytics.foodDiaryStats.weekly.map((diary: any) => ({
            date: diary.week,
            count: diary.count,
          }));
        case "Monthly":
          return analytics.foodDiaryStats.monthly.map((diary: any) => ({
            date: diary.month,
            count: diary.count,
          }));
        case "Yearly":
          return analytics.foodDiaryStats.yearly.map((diary: any) => ({
            date: diary.year ?? "Unspecified",
            count: diary.count,
          }));
        default:
          return analytics.foodDiaryStats.daily.map((diary: any) => ({
            date: diary._id,
            count: diary.count,
          }));
      }
    };

    const roleData = analytics.roleDistribution
      ? Object.entries(analytics.roleDistribution).map(([key, value]) => {
          let roleName;
          switch (key) {
            case "0":
              roleName = "Others";
              break;
            case "1":
              roleName = "Lecturer/Researcher";
              break;
            case "2":
              roleName = "Registered Dietitian/Clinical Nutritionist";
              break;
            case "3":
              roleName = "Nutrition Student";
              break;
            case "null":
              roleName = "Unspecified";
              break;
            default:
              roleName = `Role ${key}`;
          }
          return {
            name: roleName,
            value: value as unknown as number,
          };
        })
      : [];

    const getSignupData = () => {
      switch (signupPeriod) {
        case "Daily":
          return analytics.dailySignups.slice(0, 30).map((signup: any) => ({
            date: signup._id,
            signups: signup.count,
          }));
        case "Weekly":
          return analytics.weeklySignupStat.map((signup: any) => ({
            date: signup.week,
            signups: signup.count,
          }));
        case "Monthly":
          return analytics.monthlySignupStat.map((signup: any) => ({
            date: signup.month,
            signups: signup.count,
          }));
        case "Yearly":
          return analytics.yearlySignupStat.map((signup: any) => ({
            date: signup.year,
            signups: signup.count,
          }));
        default:
          return analytics.dailySignups.slice(0, 30).map((signup: any) => ({
            date: signup._id,
            signups: signup.count,
          }));
      }
    };

    const getUsageData = () => {
      switch (usagePeriod) {
        case "Daily":
          return analytics.dailyUsage.map((usage: any) => ({
            date: usage._id,
            usage: usage.count,
          }));
        case "Weekly":
          return analytics.weeklyUsage.map((usage: any) => ({
            date: usage.week,
            usage: usage.count,
          }));
        case "Monthly":
          return analytics.monthlyUsage.map((usage: any) => ({
            date: usage.month,
            usage: usage.count,
          }));
        case "Yearly":
          return analytics.yearlyUsage.map((usage: any) => ({
            date: usage.year,
            usage: usage.count,
          }));
        default:
          return analytics.dailyUsage.map((usage: any) => ({
            date: usage._id,
            usage: usage.count,
          }));
      }
    };

    const calculatorData = analytics.mostUsedCalculators.map((calc: any) => ({
      calculator: calc.name,
      count: calc.count,
    }));

    const getCalculatorTrends = () => {
      const baseData = (() => {
        switch (period) {
          case "Daily":
            return analytics.dailyCalculations
              .slice(0, 60)
              .map((calc: any) => ({
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

      const totalCalculations = analytics.mostUsedCalculators.reduce(
        (sum, calc) => sum + calc.count,
        0
      );
      const calculatorRatios = analytics.mostUsedCalculators.reduce(
        (acc, calc) => {
          acc[calc.name] = calc.count / totalCalculations;
          return acc;
        },
        {} as Record<string, number>
      );

      return baseData.map((item: any) => ({
        date: item.date,
        BMI: Math.floor(item.total * (calculatorRatios.BMI || 0)),
        IBW: Math.floor(item.total * (calculatorRatios.IBW || 0)),
        WHR: Math.floor(item.total * (calculatorRatios.WHR || 0)),
        BMR: Math.floor(item.total * (calculatorRatios.BMR || 0)),
        EE: Math.floor(item.total * (calculatorRatios.EE || 0)),
      }));
    };

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

    const topCalculatorUsersData = analytics.userCalculations
      .slice(0, 8)
      .map((user: any) => ({
        user: user.name.substring(0, 10),
        calculations: user.totalCalculations,
        avgPerDay: Math.floor(user.totalCalculations / 30),
      }));

    return {
      roleData,
      signupData: getSignupData(),
      usageData: getUsageData(),
      foodDiaryData: getFoodDiaryStats(),
      calculatorData,
      calculatorTrends: getCalculatorTrends(),
      userActivityData,
      topCalculatorUsersData,
    };
  }, [analytics, period, usagePeriod, signupPeriod, foodDiaryPeriod]);

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

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading analytics: {error}</p>
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

  if (!analytics || !chartData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">No analytics data available</p>
          <button onClick={handleRefresh}>Load Analytics</button>
        </div>
      </div>
    );
  }
  console.log(chartData.foodDiaryData)
  // console.log(chartData.usageData)
  // console.log(chartData.topCalculatorUsersData)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold mb-2">
            {foodDiaryPeriod} Food Diary Stats
          </h2>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={foodDiaryPeriod}
            onChange={(e) => setFoodDiaryPeriod(e.target.value as any)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData.foodDiaryData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

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

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold mb-2">
            {signupPeriod} Signup Rate
          </h2>
          <select
            className="border px-2 py-1 rounded text-sm"
            value={signupPeriod}
            onChange={(e) => setSignupPeriod(e.target.value as any)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.signupData}>
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

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Top Calculator Users</h2>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData.topCalculatorUsersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="user" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="calculations"
              barSize={20}
              fill="#f97316"
              name="Total Calculations"
            />
            <Line
              type="monotone"
              dataKey="avgPerDay"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Avg per Day"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
