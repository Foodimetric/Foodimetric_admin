import { useEffect, useState } from "react";
import { FOODIMETRIC_HOST_URL } from "../../utils";


// Types based on your original dashboard code
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
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
      console.log("Analytics data:", data);
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics };
};
