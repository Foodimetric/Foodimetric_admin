import { useState } from "react";
import { Switch, Dialog } from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils";
import { useActivityLog, ACTION_TYPES } from "../Activity-log/context/ActivityLogContext";


export const GeneralSettings = ({
  maintenanceMode,
  setMaintenanceMode,
}: {
  maintenanceMode: boolean;
  userRegistration: boolean;
  setMaintenanceMode: (val: boolean) => void;
  setUserRegistration: (val: boolean) => void;
}) => {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState(false);
  const [confirmationWord, setConfirmationWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { logDestructiveAction } = useActivityLog();

  const REQUIRED_CONFIRMATION_WORD = "CONFIRM";

  const handleMaintenanceToggle = (newValue: boolean) => {
    const actionType = newValue
      ? ACTION_TYPES.ENABLE_MAINTENANCE
      : ACTION_TYPES.DISABLE_MAINTENANCE;

    logDestructiveAction(actionType, async () => {
      await performMaintenanceToggle(newValue);
    });
  };

  const performMaintenanceToggle = async (newValue: boolean) => {
    setPendingMaintenanceState(newValue);
    setConfirmModalOpen(true);
    setConfirmationWord("");
    setError(null);
  };

  const handleConfirmMaintenance = async () => {
    if (confirmationWord !== REQUIRED_CONFIRMATION_WORD) {
      setError("Please type 'CONFIRM' to proceed");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/maintenance-mode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
          body: JSON.stringify({
            enabled: pendingMaintenanceState,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error ||
            `Failed to update maintenance mode: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Maintenance mode updated successfully:", data);

      setMaintenanceMode(pendingMaintenanceState);
      setConfirmModalOpen(false);
      setConfirmationWord("");

    } catch (error) {
      console.error("Error updating maintenance mode:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update maintenance mode"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setConfirmModalOpen(false);
    setPendingMaintenanceState(maintenanceMode);
    setConfirmationWord("");
    setError(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          General Settings
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">
              Enable Maintenance Mode
            </span>
            <span className="text-sm text-gray-500 mt-1">
              {maintenanceMode
                ? "System is currently in maintenance mode"
                : "System is currently available to users"}
            </span>
          </div>
          <Switch
            checked={maintenanceMode}
            onChange={handleMaintenanceToggle}
            className={`${
              maintenanceMode ? "bg-red-500" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span
              className={`${
                maintenanceMode ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      <Dialog
        open={confirmModalOpen}
        onClose={handleCancelConfirmation}
        className="relative z-40" 
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" size={24} />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {pendingMaintenanceState ? "Enable" : "Disable"} Maintenance
                  Mode
                </Dialog.Title>
              </div>
              <button
                onClick={handleCancelConfirmation}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                {pendingMaintenanceState
                  ? "⚠️ This will put the system into maintenance mode. Users will not be able to access the application."
                  : "✅ This will disable maintenance mode and make the system available to all users."}
              </p>

              <p className="text-sm font-medium text-gray-800 mb-2">
                Type <span className="font-bold text-red-600">CONFIRM</span> to
                proceed:
              </p>

              <input
                type="text"
                value={confirmationWord}
                onChange={(e) => setConfirmationWord(e.target.value)}
                placeholder="Type CONFIRM"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelConfirmation}
                disabled={loading}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMaintenance}
                className={`px-4 py-2 text-sm text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmationWord !== REQUIRED_CONFIRMATION_WORD
                    ? "bg-gray-400 cursor-not-allowed"
                    : pendingMaintenanceState
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading
                  ? "Updating..."
                  : pendingMaintenanceState
                  ? "Enable Maintenance"
                  : "Disable Maintenance"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
