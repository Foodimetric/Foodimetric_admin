import { useNotification } from "../context/NotificationContext";
import { cn } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationType } from "../types/notification";

const badgeColors = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

export const NotificationPanel = () => {
  const { notifications, markAsRead } = useNotification();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all"
  );

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Admin Notifications</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No notifications match the filter.
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((note) => (
            <li
              key={note.id}
              className={cn(
                "p-4 rounded border cursor-pointer",
                note.read ? "bg-gray-50" : "bg-gray-100 border-blue-200"
              )}
              onClick={() => {
                markAsRead(note.id);
                navigate("/notifications");
              }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(note.id);
                    }}
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
