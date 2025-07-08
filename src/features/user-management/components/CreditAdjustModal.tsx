import { useState } from "react";
import { User } from "../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
  onClose: () => void;
}

export const CreditAdjustModal = ({ user, onClose }: Props) => {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    toast.success(`Successfully adjusted ${amount} points for ${user.name}`, {
      icon: "💰",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Adjust Foodipoints</h2>
        <p className="mb-2">User: {user.name}</p>
        <input
          type="number"
          className="w-full border p-2 rounded mb-2"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Reason for adjustment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
