export type UserRole = "client" | "dietitian" | "student";

export interface User {
  id: string;
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

export const dummyUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    usage: 150,
    category: 1,
    googleId: "google123",
    credits: 750,
    lastUsageDate: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    usage: 89,
    category: 2,
    googleId: "google456",
    credits: 320,
    lastUsageDate: "2024-01-10",
    verified: false,
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    usage: 200,
    category: 3,
    googleId: "google789",
    credits: 450,
    lastUsageDate: "2024-01-12",
    verified: true,
  },
  {
    id: "4",
    email: "alice.brown@example.com",
    firstName: "Alice",
    lastName: "Brown",
    usage: 67,
    category: 1,
    googleId: "google101112",
    credits: 890,
    lastUsageDate: "2024-01-14",
    verified: true,
  },
  {
    id: "5",
    email: "charlie.davis@example.com",
    firstName: "Charlie",
    lastName: "Davis",
    usage: 134,
    category: 2,
    googleId: "google131415",
    credits: 125,
    lastUsageDate: "2024-01-08",
    verified: false,
  },
];