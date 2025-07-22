import { createContext, useContext, useState, ReactNode } from "react";
import { ActivityLog } from "../types/activityLog";

interface ActivityLogContextType {
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, "id">) => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(
  undefined
);

const initialLogs: ActivityLog[] = [
  {
    id: "1",
    user: "admin@foodimetric.com",
    action: "Generated promo code for john@example.com",
    timestamp: "2025-07-06 13:45:23",
  },
  {
    id: "2",
    user: "support@foodimetric.com",
    action: "Suspended user jane@example.com",
    timestamp: "2025-07-06 12:21:10",
  },
];

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);

  const addLog = (log: Omit<ActivityLog, "id">) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      ...log,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error(
      "useActivityLog must be used within an ActivityLogProvider"
    );
  }
  return context;
};
