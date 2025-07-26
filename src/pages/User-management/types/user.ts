export type UserRole = "client" | "dietitian" | "student";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  usage: number;
  category: number;
  googleId: string;
  credits: number;
  lastUsageDate: string;
  verified: boolean;
}

export const ITEMS_PER_PAGE = 12;

export const dummyUsers: User[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@mail.com`,
  firstName: `User${i + 1}`,
  lastName: `Lastname${i + 1}`,
  usage: Math.floor(Math.random() * 100),
  category: Math.floor(Math.random() * 4),
  googleId: `google-${i + 1}`,
  credits: 1000 - Math.floor(Math.random() * 100),
  lastUsageDate: i % 3 === 0 ? "N/A" : `1${i % 9}/07/2025`,
  verified: i % 2 === 0,
}));