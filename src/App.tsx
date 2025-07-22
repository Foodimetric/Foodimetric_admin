import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserManagementPage } from "./features/user-management/pages/UserManagementPage";
import AdminLayout from "./layouts/AdminLayout";
import { PromoCodePage } from "./features/promo-codes/pages/PromoCodePage";
import { ActivityLogPage } from "./features/activity-logs/pages/ActivityLogPage";
import { ActivityLogProvider } from "./features/activity-logs/context/ActivityLogContext";
import { NotificationPage } from "./features/notification/pages/NotificationPage";
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Dashboard } from "./features/analytics/pages/Dashboard";

function App() {
  return (
    <Router>
      <AdminLayout>
        <ActivityLogProvider>
          <Routes>
            <Route path="/users" element={<UserManagementPage />} />
            <Route
              path="/dashboard"
              element={<Dashboard /> }
            />
            {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
            <Route path="/promo-codes" element={<PromoCodePage />} />
            <Route path="/activity-logs" element={<ActivityLogPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route
              path="/settings"
              element={<div className="text-xl font-bold">Admin Settings</div>}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/test" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ActivityLogProvider>
      </AdminLayout>
    </Router>
  );
}

export default App;
