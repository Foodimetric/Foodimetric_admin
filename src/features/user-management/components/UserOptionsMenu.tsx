import { useState } from "react";
import { User } from "../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
  onViewDetails: (user: User) => void;
}

export const UserOptionsMenu = ({ user, onViewDetails }: Props) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: string) => {
    toast.success(`${action} action for ${user.name}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="px-2 py-1 text-gray-600 hover:text-black"
        onClick={() => setOpen(!open)}
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
          <button
            onClick={() => onViewDetails(user)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            View Details
          </button>
          <button
            onClick={() => handleAction("Activate")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Activate
          </button>
          <button
            onClick={() => handleAction("Suspend")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Suspend
          </button>
          <button
            onClick={() => handleAction("Delete")}
            className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};
