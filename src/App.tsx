import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserManagementPage } from "./pages/User-management/UserManagementPage";
import AdminLayout from "./layouts/AdminLayout";
import { PromoCodePage } from "./pages/Promo-code/PromoCodePage";
import { ActivityLogPage } from "./pages/Activity-log/ActivityLogPage";
import { ActivityLogProvider } from "./pages/Activity-log/context/ActivityLogContext";
import { NotificationPage } from "./pages/Notification/NotificationPage";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { AdminSettings } from "./pages/Settings/AdminSettings";
import { AIChatDashboard } from "./pages/AI-chats/AIChats";
import { CustomPrompts } from "./pages/AI-chats/CustomPrompt";
import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";

function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ActivityLogProvider>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagementPage />} />
                        <Route path="/ai-chats" element={<AIChatDashboard />} />
                        <Route
                          path="/ai-chats/custom-prompt"
                          element={<CustomPrompts />}
                        />
                        <Route
                          path="/promo-codes"
                          element={<PromoCodePage />}
                        />
                        <Route
                          path="/activity-logs"
                          element={<ActivityLogPage />}
                        />
                        <Route
                          path="/notification"
                          element={<NotificationPage />}
                        />
                        <Route path="/settings" element={<AdminSettings />} />
                        <Route path="/test" element={<Dashboard />} />
                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" replace />}
                        />
                      </Routes>
                    </ActivityLogProvider>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default App;
