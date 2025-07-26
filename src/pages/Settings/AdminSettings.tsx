import { useState } from "react";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";
import { GeneralSettings } from "./GeneralSettings";
import { UserManagement } from "./UserManagement";
import { CreateUserModal } from "./CreateUserModal";
import { Actions } from "./Actions";

export const AdminSettings = ({ isSuperAdmin = true }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [userRegistration, setUserRegistration] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [showModal, setShowModal] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Login credentials sent to ${newEmail}`);
    setShowModal(false);
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
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isSuperAdmin
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          Logged in as {isSuperAdmin ? "Super Admin" : "Admin"}
        </div>
      </div>

      <GeneralSettings
        maintenanceMode={maintenanceMode}
        userRegistration={userRegistration}
        setMaintenanceMode={setMaintenanceMode}
        setUserRegistration={setUserRegistration}
      />

      {isSuperAdmin && <UserManagement onAdd={() => setShowModal(true)} />}
      <Actions />

      {showModal && (
        <CreateUserModal
          email={newEmail}
          password={newPassword}
          role={newRole}
          setEmail={setNewEmail}
          setPassword={setNewPassword}
          setRole={setNewRole}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
};
