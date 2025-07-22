import { useState, useEffect } from "react";
import TopAnthropometricUsers from "./components/TopAnthropometricUsers";
import TopUsersTable from "./components/TopUsersTable";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { OverviewCards } from "./components/OverviewCards";
import { SkeletonBox } from "../../components/SkeletonBox";

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="space-y-6">
          <SkeletonBox height="h-24" />
          <SkeletonBox height="h-80" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonBox height="h-64" />
            <SkeletonBox height="h-64" />
          </div>
        </div>
      ) : (
        <>
          <OverviewCards />
          <AnalyticsDashboard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopUsersTable />
            <TopAnthropometricUsers />
          </div>
        </>
      )}
    </div>
  );
};
