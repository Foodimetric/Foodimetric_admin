export type NotificationType = "info" | "warning" | "critical";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}
