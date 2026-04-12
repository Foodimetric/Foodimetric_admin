export type UserRole = "client" | "dietitian" | "student";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  usage: number;
  category: number;
  googleId: string | null;
  credits: number;
  lastUsageDate: string;
  rawLastUsageDate: Date | null;
  longestStreak: number;
  verified: boolean;
  location: string;
  streak: number;
  healthProfile: any;
  status: any;
  partnerDetails: any;
  latestFoodLogs: any;
  latestCalculation: any;
  notifications: any;
  fcmTokens: any;
}

export const ITEMS_PER_PAGE = 10;