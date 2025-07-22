import { useState } from "react";
import { Switch } from "@headlessui/react";
import {
  Save,
  Settings,
  RefreshCcw,
  ShieldAlert,
  Trash2,
} from "lucide-react";

export const AdminSettings = ({ isSuperAdmin = false }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [userRegistration, setUserRegistration] = useState(true);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Settings className="text-blue-600" /> Admin Settings
        </h1>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isSuperAdmin
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          Logged in as {isSuperAdmin ? "Super Admin" : "Admin"}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          General Settings
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            Enable Maintenance Mode
          </span>
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
          <span className="text-gray-700 font-medium">
            Allow User Registration
          </span>
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

      {/* Security Actions */}
      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Security Actions
        </h2>

        <button className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition">
          <RefreshCcw size={18} /> Refresh All Tokens
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
          <ShieldAlert className="text-red-600" /> Danger Zone
        </h2>
        <p className="text-sm text-red-600 leading-relaxed">
          Clicking this button will reset all verified users’ credits to{" "}
          <b>1000</b>.
          <br /> This action is <span className="font-bold">
            irreversible
          </span>{" "}
          and can only be used on the <b>1st day of the month</b>.
        </p>
        <button className="w-full py-3 px-4 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition">
          <Trash2 size={18} /> Reset All User Credits to 1000
        </button>
      </div>
    </div>
  );
};
