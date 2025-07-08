import { User } from "../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

export const AccountStatusToggle = ({ user }: Props) => {
  const toggleStatus = () => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    toast.success(`${user.name}'s account has been ${newStatus}.`, {
      icon: newStatus === "active" ? "✅" : "🚫",
    });
  };

  return (
    <button
      onClick={toggleStatus}
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        user.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {user.status === "active" ? "Active" : "Suspended"}
    </button>
  );
};
