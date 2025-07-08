import { useEffect, useState } from "react";
import { User } from "../types/user";

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dummy data
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "dietitian",
          status: "active",
          foodiPoints: 120,
          expirationDate: "2025-12-31",
          lastLogin: "2025-07-05",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { users, isLoading };
};
