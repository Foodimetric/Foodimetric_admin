import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserManagementPage } from "./features/user-management/pages/UserManagementPage";
import AdminLayout from "./layouts/AdminLayout";
import { AnalyticsPage } from "./features/analytics/pages/AnalyticsPage";
import { PromoCodePage } from "./features/promo-codes/pages/PromoCodePage";
import { ActivityLogPage } from "./features/activity-logs/pages/ActivityLogPage";
import { ActivityLogProvider } from "./features/activity-logs/context/ActivityLogContext";
import { NotificationPage } from "./features/notification/pages/NotificationPage";

function App() {
  return (
    <Router>
      <AdminLayout>
        <ActivityLogProvider>
          <Routes>
            <Route path="/users" element={<UserManagementPage />} />
            <Route
              path="/dashboard"
              element={
                <div className="text-xl font-bold">Dashboard Overview</div>
              }
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/promo-codes" element={<PromoCodePage />} />
            <Route path="/activity-logs" element={<ActivityLogPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route
              path="/settings"
              element={<div className="text-xl font-bold">Admin Settings</div>}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ActivityLogProvider>
      </AdminLayout>
    </Router>
  );
}

export default App;
