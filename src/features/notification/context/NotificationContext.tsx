import { createContext, useContext, useState, ReactNode } from "react";
import { AdminNotification, NotificationType } from "../types/notification";

interface NotificationContextType {
  notifications: AdminNotification[];
  addNotification: (
    notification: Omit<AdminNotification, "id" | "read">
  ) => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const addNotification = (
    notification: Omit<AdminNotification, "id" | "read">
  ) => {
    const newNotification: AdminNotification = {
      id: crypto.randomUUID(),
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
