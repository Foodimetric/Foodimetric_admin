import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { FOODIMETRIC_HOST_URL } from "../utils";

type DailyCalculation = { _id: string; count: number };
type WeeklyCalculation = DailyCalculation & { week: string };
type MonthlyCalculation = DailyCalculation & { month: string };
type YearlyCalculation = DailyCalculation & { year: string };
type DailyUsage = { _id: string; count: number };
type DailySignup = { _id: string; count: number };

type UserCalculation = {
  name: string;
  calculations: { date: string; count: number }[];
  totalCalculations: number;
  id: string;
};

type MostUsedCalculator = { name: string; count: number; trend: number };
type TopUser = {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: string;
};
type AnthropometricStats = { weekly: number };

type UserData = {
  suspended: boolean;
  category: number;
  usage: number;
  googleId: string;
  lastUsageDate: string | null;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  credits: number;
};

type RoleDistribution = {
  _id: string;
  count: number;
};

export type AnalyticsData = {
  userCalculations: UserCalculation[];
  allUsers: UserData[];
  dailyCalculations: DailyCalculation[];
  weeklyCalculations: WeeklyCalculation[];
  monthlyCalculations: MonthlyCalculation[];
  yearlyCalculations: YearlyCalculation[];
  dailyUsage: DailyUsage[];
  dailySignups: DailySignup[];
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
  roleDistribution: RoleDistribution[]; 
};

interface AnalyticsContextType {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  clearData: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setLoading(true);
    setError("");

    try {
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
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const data = (await response.json()) as AnalyticsData;
      setAnalytics(data);
      setHasInitialized(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      if (err instanceof Error && err.message.includes("401")) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setAnalytics(null);
    setHasInitialized(false);
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    const initializeAnalytics = async () => {
      const token = localStorage.getItem("authToken");
      const currentPath = window.location.pathname;

      const isPublicRoute =
        currentPath.includes("/login") || currentPath.includes("/verify-email");

      if (token && !hasInitialized && !analytics && !isPublicRoute) {
        await fetchAnalytics();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && !e.newValue) {
        clearData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    initializeAnalytics();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [hasInitialized, analytics]);

  const contextValue: AnalyticsContextType = {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    clearData,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
