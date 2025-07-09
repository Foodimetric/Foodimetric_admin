import { useNotification } from "../../notification/context/NotificationContext";

export const useSuspendAccount = () => {
  const { addNotification } = useNotification();

  const suspend = (user: { name: string; id: string }) => {
    // Logic to suspend user...

    addNotification({
      title: "Account Suspended",
      message: `User ${user.name}'s account has been suspended by Admin.`,
      type: "warning",
      timestamp: new Date().toISOString(),
    });
  };

  return { suspend };
};
