import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Percent,
  ListOrdered,
  Bell,
  Settings,
  Menu,
  LogOut,
  BotMessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { NotificationBell } from "../components/NotificationBell";
import { useAuth } from "../components/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users },
  {
    name: "AI Chats",
    path: "/ai-chats",
    icon: BotMessageSquare,
    subNav: [{ name: "Custom Prompt", path: "/ai-chats/custom-prompt" }],
  },
  { name: "Promo Codes", path: "/promo-codes", icon: Percent },
  { name: "Activity Logs", path: "/activity-logs", icon: ListOrdered },
  { name: "Notifications", path: "/notification", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];


const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  // const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

 const handleLogout = () => {
   if (window.confirm("Are you sure you want to logout?")) {
     logout();
   }
 };

  const closeSidebar = () => setMobileOpen(false);

  const SidebarContent = (
    <div className="h-screen flex flex-col justify-between overflow-y-auto bg-white border-r border-gray-200 w-56">
      <div className="p-4 space-y-6">
        <img
          src="img/logo.png"
          alt="Foodimetric"
          width={150}
          className="mt-4"
        />
        <nav className="space-y-2">
          {navItems.map(({ name, path, icon: Icon, subNav }) => (
            <div key={name}>
              <Link
                to={path}
                onClick={closeSidebar}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-base transition-all",
                  location.pathname.startsWith(path)
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>

              {subNav && location.pathname.startsWith(path) && (
                <div className="relative ml-6 mt-2">
                  <div className="absolute left-0 top-0 w-4 h-4">
                    <div className="w-0.5 h-full bg-blue-300 absolute left-1.5 top-0" />
                    <div className="w-2 h-0.5 bg-blue-300 absolute top-3 left-1.5" />
                  </div>
                  <div className="absolute left-4 top-[7px] w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />

                  <div className="ml-4 space-y-1 pl-4">
                    {subNav.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={closeSidebar}
                        className={clsx(
                          "block text-sm px-3 py-1 rounded-md transition-all",
                          location.pathname === sub.path
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block bg-white shadow-lg z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative z-50 bg-white shadow-lg">
            {SidebarContent}
          </div>
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black opacity-30"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 h-screen overflow-y-auto bg-gray-50">
        {/* Mobile Topbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-10 w-full lg:hidden">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h2>
          <NotificationBell />
        </div>

        {/* Desktop Topbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white shadow sticky top-0 z-10 w-full">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <NotificationBell />
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
