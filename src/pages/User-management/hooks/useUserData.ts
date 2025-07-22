import { useEffect, useState } from "react";
import { User } from "../../../pages/User-management/types/user";

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dummy data
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          firstName: "User",
          lastName: "One",
          email: "user1@example.com",
          usage: 120,
          category: 1,
          googleId: "google-uid-1",
          credits: 500,
          lastUsageDate: "2025-07-20",
          verified: true,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return { users, isLoading };
};
