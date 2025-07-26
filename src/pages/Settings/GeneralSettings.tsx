import { Switch } from "@headlessui/react";
import { Save } from "lucide-react";

export const GeneralSettings = ({
  maintenanceMode,
  userRegistration,
  setMaintenanceMode,
  setUserRegistration,
}: {
  maintenanceMode: boolean;
  userRegistration: boolean;
  setMaintenanceMode: (val: boolean) => void;
  setUserRegistration: (val: boolean) => void;
}) => (
  <div className="bg-white rounded-xl shadow p-6 space-y-6">
    <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>

    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">Enable Maintenance Mode</span>
      <Switch
        checked={maintenanceMode}
        onChange={setMaintenanceMode}
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

    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">Allow User Registration</span>
      <Switch
        checked={userRegistration}
        onChange={setUserRegistration}
        className={`${
          userRegistration ? "bg-green-500" : "bg-gray-300"
        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span
          className={`${
            userRegistration ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>

    <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition">
      <Save size={18} /> Save Settings
    </button>
  </div>
);
