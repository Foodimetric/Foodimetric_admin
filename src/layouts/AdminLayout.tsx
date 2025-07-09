import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotificationBell } from "../components/NotificationBell";


const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "User Management", path: "/users" },
  { name: "Analytics", path: "/analytics" },
  { name: "Promo Codes", path: "/promo-codes" },
  { name: "Activity Logs", path: "/activity-logs" },
  { name: "Notifications", path: "/notification" },

  { name: "Settings", path: "/settings" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Foodimetric</h1>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 bg-gray-50">
        <header className="bg-white shadow p-4 text-lg font-semibold">
          <div className="flex items-center justify-between px-4 py-2 bg-white">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <NotificationBell />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
