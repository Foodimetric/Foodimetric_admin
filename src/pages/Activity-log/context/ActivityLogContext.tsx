import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Dialog } from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";
import { ActivityLog } from "../types/activityLog";
import { FOODIMETRIC_HOST_URL } from "../../../utils";

export const ACTION_TYPES = {
  // Authentication actions
  LOGIN: "Logged in",
  LOGOUT: "Logged out",

  // User management
  SUSPEND_USER: "Suspended a user",
  ACTIVATE_USER: "Activated a user",
  DELETE_USER: "Deleted a user",

  // System settings
  ENABLE_MAINTENANCE: "Enabled maintenance mode",
  DISABLE_MAINTENANCE: "Disabled maintenance mode",
  UPDATE_SETTINGS: "Updated system settings",

  // Content management
  CREATE_PROMPT: "Created a custom prompt",
  DELETE_PROMPT: "Deleted a custom prompt",

  // General actions
  EXPORT_USER_DATA: "Exported user data",
  EXPORT_AI_CHATS: "Exported AI chats",
};

export const DESTRUCTIVE_ACTIONS = [
  ACTION_TYPES.ACTIVATE_USER,
  ACTION_TYPES.DELETE_USER,
  ACTION_TYPES.SUSPEND_USER,
  ACTION_TYPES.DELETE_PROMPT,
  ACTION_TYPES.ENABLE_MAINTENANCE,
];

export const UserDataManager = {
  storeUserData(loginResponse: any) {
    const userData = {
      admin_id: loginResponse.admin_id,
      role: loginResponse.role,
      name: loginResponse.name,
      token: loginResponse.token,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("authToken", loginResponse.token);
  },

  getUserData() {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  clearUserData() {
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  },
};

export class ActivityLogger {
  static async logActivity(action: string, meta: any = null) {
    try {
      const userData = UserDataManager.getUserData();
      const authToken = localStorage.getItem("authToken");

      // Early return if no user data or token (prevents errors)
      if (!userData || !authToken) {
        console.warn("Cannot log activity: Missing user data or auth token");
        return;
      }

      // Prepare request body with required fields
      const requestBody: any = {
        user: userData.admin_id,
        role: userData.role,
        action: action,
      };

      // Only add meta field if provided (API requirement)
      if (meta) {
        requestBody.meta = meta;
      }

      // Send POST request to log activity
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/activity/log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `Failed to log activity: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Activity logged successfully:", result);
      return result;
    } catch (error) {
      console.error("Error logging activity:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }
}

interface ReasonModalProps {
  isOpen: boolean;
  pendingAction: string | null;
  reason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Move ReasonModal outside of the context provider
const ReasonModal = ({
  isOpen,
  pendingAction,
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
  isLoading,
}: ReasonModalProps) => {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-[9999]">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={24} />
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Action Confirmation
              </Dialog.Title>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              You are about to perform: <strong>{pendingAction}</strong>
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide a reason for this action:
            </label>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter reason for this action..."
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading || reason.trim().length < 3}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

interface ActivityLogContextType {
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, "id">) => void;
  logActivity: (action: string, meta?: any) => Promise<void>;
  logDestructiveAction: (
    action: string,
    onConfirm?: () => Promise<void>
  ) => void;
  isLoading: boolean;
  error: string | null;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(
  undefined
);

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Modal states for destructive actions confirmation
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    action: string;
    onConfirm?: () => Promise<void>;
  } | null>(null);
  const [reason, setReason] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const logActivity = useCallback(async (action: string, meta?: any) => {
    try {
      await ActivityLogger.logActivity(action, meta);
    } catch (error) {
      console.error("Error in logActivity:", error);
    }
  }, []);

  /**
   * Initiates logging of a destructive action (requires user confirmation)
   * @param action - Action message to log
   * @param onConfirm - Callback function to execute after confirmation
   */
  const logDestructiveAction = useCallback(
    (action: string, onConfirm?: () => Promise<void>) => {
      console.log("logDestructiveAction called", action);
      setPendingAction({ action, onConfirm });
      setShowReasonModal(true);
      setReason("");
    },
    []
  );

  /**
   * Handles confirmation of destructive action
   * Validates reason input and executes the action
   */
  const handleConfirmAction = useCallback(async () => {
    if (reason.trim().length < 3) {
      alert("Please provide a reason with at least 3 characters");
      return;
    }

    if (!pendingAction) return;

    try {
      setModalLoading(true);
      await logActivity(pendingAction.action, { reason: reason.trim() });

      if (pendingAction.onConfirm) {
        await pendingAction.onConfirm();
      }

      // Reset modal state
      setShowReasonModal(false);
      setPendingAction(null);
      setReason("");
    } catch (error) {
      console.error("Error in destructive action:", error);
    } finally {
      setModalLoading(false);
    }
  }, [reason, pendingAction, logActivity]);

  const handleCancelAction = useCallback(() => {
    setShowReasonModal(false);
    setPendingAction(null);
    setReason("");
  }, []);

  const addLog = useCallback((log: Omit<ActivityLog, "id">) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      ...log,
    };
    setLogs((prev) => [newLog, ...prev]);
  }, []);

  const contextValue = useMemo(
    () => ({
      logs,
      addLog,
      logActivity,
      logDestructiveAction,
      isLoading,
      error,
    }),
    [logs, addLog, logActivity, logDestructiveAction, isLoading, error]
  );

  return (
    <ActivityLogContext.Provider value={contextValue}>
      {children}
      <ReasonModal
        isOpen={showReasonModal}
        pendingAction={pendingAction?.action || null}
        reason={reason}
        onReasonChange={setReason}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isLoading={modalLoading}
      />
    </ActivityLogContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================
export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error(
      "useActivityLog must be used within an ActivityLogProvider"
    );
  }
  return context;
};
