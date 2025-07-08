import { BarChartFoodiPoints } from "../components/BarChartFoodiPoints";
import { OverviewCards } from "../components/OverviewCards";
import { UserRolePieChart } from "../components/UserRolePieChart";

export const AnalyticsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <OverviewCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartFoodiPoints />
        <UserRolePieChart />
      </div>
    </div>
  );
};