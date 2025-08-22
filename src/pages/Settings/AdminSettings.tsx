import { useState } from "react";
import { Settings } from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { UserManagement } from "./UserManagement";
import { CreateUserModal } from "./CreateUserModal";
import { Actions } from "./Actions";

export const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [userRegistration, setUserRegistration] = useState(true);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [showModal, setShowModal] = useState(false);

  const currentUserRole = localStorage.getItem("userRole");
  const isSuperAdmin =
    currentUserRole === "super-admin" || currentUserRole === "super_admin";
  const isAdmin = currentUserRole === "admin";
  const isMarketing =
    currentUserRole === "marketing" || currentUserRole === "moderator";
  const isDeveloper =
    currentUserRole === "developer" || currentUserRole === "super-admin";

  // Helper function to get role display name and styling
  const getRoleDisplay = () => {
    if (isSuperAdmin) {
      return {
        name: "Super Admin",
        className: "bg-purple-100 text-purple-700",
      };
    } else if (isAdmin) {
      return {
        name: "Admin",
        className: "bg-blue-100 text-blue-700",
      };
    } else if (isMarketing) {
      return {
        name: "Marketing",
        className: "bg-green-100 text-green-700",
      };
    } else if (isDeveloper) {
      return {
        name: "Developer",
        className: "bg-orange-100 text-orange-700",
      };
    } else {
      return {
        name: "Unknown Role",
        className: "bg-gray-100 text-gray-700",
      };
    }
  };

  const roleDisplay = getRoleDisplay();

  const canManageSettings = isSuperAdmin || isAdmin || isDeveloper;
  const canManageUsers = isSuperAdmin;
  const canAccessActions = isSuperAdmin || isAdmin;

  const handleModalClose = () => {
    setShowModal(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("admin");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Settings className="text-blue-600" /> Admin Settings
        </h1>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${roleDisplay.className}`}
        >
          Logged in as {roleDisplay.name}
        </div>
      </div>

      {canManageSettings && (
        <GeneralSettings
          maintenanceMode={maintenanceMode}
          userRegistration={userRegistration}
          setMaintenanceMode={setMaintenanceMode}
          setUserRegistration={setUserRegistration}
        />
      )}

      {canManageUsers && <UserManagement onAdd={() => setShowModal(true)} />}

      {canAccessActions && <Actions />}

      {isMarketing && !isAdmin && !isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Limited Access
          </h2>
          <p className="text-yellow-700">
            Your marketing role has limited access to admin settings. Contact a
            Super Admin for additional permissions.
          </p>
        </div>
      )}

      {!isSuperAdmin && !isAdmin && !isMarketing && !isDeveloper && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-700">
            Your current role does not have permission to access admin settings.
          </p>
        </div>
      )}

      {showModal && canManageUsers && (
        <CreateUserModal
          name={newName}
          email={newEmail}
          password={newPassword}
          role={newRole}
          setName={setNewName}
          setEmail={setNewEmail}
          setPassword={setNewPassword}
          setRole={setNewRole}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
