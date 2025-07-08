import { useNotification } from "../context/NotificationContext";
import { cn } from "../../../lib/utils";

const badgeColors = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

export const NotificationPanel = () => {
  const { notifications, markAsRead } = useNotification();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Admin Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li
              key={note.id}
              className={cn(
                "p-4 rounded border",
                note.read ? "bg-gray-50" : "bg-gray-100 border-blue-200"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      badgeColors[note.type]
                    }`}
                  >
                    {note.type.toUpperCase()}
                  </span>
                  <h4 className="font-semibold mt-1">{note.title}</h4>
                  <p className="text-sm text-gray-700">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.timestamp).toLocaleString()}
                  </p>
                </div>
                {!note.read && (
                  <button
                    onClick={() => markAsRead(note.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
