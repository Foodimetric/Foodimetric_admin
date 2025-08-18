// import { useState, useEffect } from "react";
import TopAnthropometricUsers from "./components/TopAnthropometricUsers";
import TopUsersTable from "./components/TopUsersTable";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { OverviewCards } from "./components/OverviewCards";

export const Dashboard = () => {
  return (
    <div>
      <>
        <OverviewCards />
        <AnalyticsDashboard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopUsersTable />
          <TopAnthropometricUsers />
        </div>
      </>
      {/* )} */}
    </div>
  );
};
