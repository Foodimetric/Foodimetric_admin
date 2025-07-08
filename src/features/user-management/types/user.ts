export type UserRole = "client" | "dietitian" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  foodiPoints: number;
  expirationDate: string;
  lastLogin: string;
}
