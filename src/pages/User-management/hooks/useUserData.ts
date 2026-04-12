import { useMemo } from "react";
import { useAnalytics } from "../../../contexts/AnalyticsContext";
import { User } from "../types/user";

export const useUserData = () => {
  const { analytics, loading, error, refetch } = useAnalytics();

  const users: User[] = useMemo(() => {
    if (!analytics?.allUsers) return [];

    return analytics.allUsers.map((user: any) => ({
      id: String(user._id),
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      usage: Number(user.usage) || 0,
      category: Number(user.category) || 0,
      googleId: user.googleId || null,
      credits: Number(user.credits) || 0,
      lastUsageDate: user.lastUsageDate
        ? new Date(user.lastUsageDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown",
      rawLastUsageDate: user.lastUsageDate
        ? new Date(user.lastUsageDate)
        : null,
      verified: Boolean(user.isVerified),
      longestStreak: Number(user.longestStreak) || 0,
      location: user.location || "",
      streak: Number(user.streak) || 0,
      healthProfile: user.healthProfile,
      latestCalculation: user.latestCalculation,
      partnerDetails: user.partnerDetails,
      status: user.status || "",
      latestFoodLogs: user.latestFoodLogs,
      notifications: user.notifications,
      fcmTokens: user.fcmTokens,
    }));
  }, [analytics]);

  return { users, loading, error, refetch };
};