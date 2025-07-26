import { useState } from "react";
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

const data = [
  { name: "Jane", foodiPoints: 300 },
  { name: "John", foodiPoints: 700 },
  { name: "Emma", foodiPoints: 450 },
  { name: "Liam", foodiPoints: 650 },
];

const roleData = [
  { name: "Dietitian", value: 540 },
  { name: "Lecturer", value: 680 },
  { name: "Student", value: 303 },
  { name: "Others", value: 100 },
];

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const dailySignups = Array.from({ length: 8 }, (_, i) => {
  const day = 15 + i;
  return {
    date: `July ${day}`,
    signups: Math.floor(Math.random() * 100) + 50,
  };
});

const generateUsageData = (period: string) => {
  if (period === "Daily") {
    return Array.from({ length: 8 }, (_, i) => ({
      date: `July ${15 + i}`,
      usage: Math.floor(Math.random() * 500) + 300,
    }));
  } else if (period === "Weekly") {
    return Array.from({ length: 6 }, (_, i) => ({
      date: `Week ${i + 1}`,
      usage: Math.floor(Math.random() * 2000) + 800,
    }));
  } else if (period === "Monthly") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
    ];
    return months.map((month) => ({
      date: month,
      usage: Math.floor(Math.random() * 5000) + 2000,
    }));
  } else {
    return [2021, 2022, 2023, 2024, 2025].map((year) => ({
      date: `${year}`,
      usage: Math.floor(Math.random() * 12000) + 5000,
    }));
  }
};

const mostUsedCalculators = [
  { calculator: "BMI", count: 560 },
  { calculator: "IBW", count: 430 },
  { calculator: "WHR", count: 320 },
  { calculator: "BMR", count: 280 },
  { calculator: "EE", count: 210 },
];

const generateCalculatorTrends = (period: string) => {
  let data: {
    date: string;
    BMI: number;
    IBW: number;
    WHR: number;
    BMR: number;
    EE: number;
  }[] = [];

  if (period === "Daily") {
    data = Array.from({ length: 8 }, (_, i) => ({
      date: `July ${15 + i}`,
      BMI: Math.floor(Math.random() * 100) + 50,
      IBW: Math.floor(Math.random() * 100) + 30,
      WHR: Math.floor(Math.random() * 80) + 20,
      BMR: Math.floor(Math.random() * 70) + 25,
      EE: Math.floor(Math.random() * 60) + 15,
    }));
  } else if (period === "Weekly") {
    data = Array.from({ length: 6 }, (_, i) => ({
      date: `Week ${i + 1}`,
      BMI: Math.floor(Math.random() * 300) + 100,
      IBW: Math.floor(Math.random() * 300) + 100,
      WHR: Math.floor(Math.random() * 200) + 80,
      BMR: Math.floor(Math.random() * 250) + 90,
      EE: Math.floor(Math.random() * 180) + 70,
    }));
  } else if (period === "Monthly") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
    ];
    data = months.map((month) => ({
      date: month,
      BMI: Math.floor(Math.random() * 500) + 200,
      IBW: Math.floor(Math.random() * 500) + 200,
      WHR: Math.floor(Math.random() * 300) + 100,
      BMR: Math.floor(Math.random() * 400) + 150,
      EE: Math.floor(Math.random() * 250) + 100,
    }));
  } else if (period === "Yearly") {
    const years = [2021, 2022, 2023, 2024, 2025];
    data = years.map((year) => ({
      date: `${year}`,
      BMI: Math.floor(Math.random() * 1000) + 500,
      IBW: Math.floor(Math.random() * 1000) + 500,
      WHR: Math.floor(Math.random() * 800) + 300,
      BMR: Math.floor(Math.random() * 900) + 350,
      EE: Math.floor(Math.random() * 700) + 250,
    }));
  }

  return data;
};

const userActivityDistribution = Array.from({ length: 8 }, (_, i) => ({
  date: `July ${15 + i}`,
  logins: Math.floor(Math.random() * 200) + 100,
  calculations: Math.floor(Math.random() * 150) + 80,
}));

const foodDiaryUsage = dailySignups.map(({ date }) => ({
  date,
  logs: Math.floor(Math.random() * 120) + 50,
  users: Math.floor(Math.random() * 80) + 30,
}));

export const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const [usagePeriod, setUsagePeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Daily");
  const calculatorTrends = generateCalculatorTrends(period);
  const usageData = generateUsageData(usagePeriod);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Foodipoint Usage */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Foodipoint Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
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
              data={roleData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {roleData.map((_entry, index) => (
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
          <LineChart data={dailySignups}>
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

      {/* Daily Usage */}
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
          <BarChart data={usageData}>
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
          <BarChart layout="vertical" data={mostUsedCalculators}>
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
          <AreaChart data={calculatorTrends}>
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
          <ComposedChart data={userActivityDistribution}>
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
        <h2 className="text-lg font-semibold mb-2">Food Diary Usage</h2>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={foodDiaryUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="logs" barSize={20} fill="#f97316" name="Logs" />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Users"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
