import { ActivityLogTable } from "./components/ActivityLogTable";

export const ActivityLogPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <ActivityLogTable />
    </div>
  );
};
