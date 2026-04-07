import { useNotification } from "../../Notification/context/NotificationContext";

export const useGeneratePromo = () => {
  const { addNotification } = useNotification();

  const generate = (user: { name: string }) => {
    addNotification({
      title: "Promo Code Generated",
      message: `A promo code was issued to ${user.name} by Admin.`,
      type: "info",
      timestamp: new Date().toISOString(),
    });
  };

  return { generate };
};
