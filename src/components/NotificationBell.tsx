import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../pages/Notification/context/NotificationContext";

export const NotificationBell = () => {
  const { notifications } = useNotification();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="relative ml-4 cursor-pointer"
      onClick={() => navigate("/notification")}
    >
      <Bell className="w-6 h-6 text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
