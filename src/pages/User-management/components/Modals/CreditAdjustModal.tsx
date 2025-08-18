import { useState } from "react";
import toast from "react-hot-toast";
import { User } from "../../types/user";
import { FOODIMETRIC_HOST_URL } from "../../../../utils";

interface Props {
  user: User;
  onClose: () => void;
}

export const CreditAdjustModal = ({ user, onClose }: Props) => {
  const [amount, setAmount] = useState<Number | null >(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (amount === 0) {
      toast.error("Please enter a valid amount");
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
        `${FOODIMETRIC_HOST_URL}/admin/update-credit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
          body: JSON.stringify({
            email: user.email,
            credit: amount,
            reason: reason || undefined, 
          }),
        }
      );

      if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }


      toast.success(
        `Successfully adjusted ${amount} credit for ${user.firstName} ${user.lastName}`,
        {
          icon: "💰",
        }
      );

      onClose();
    } catch (error) {
      console.error("Error updating credit:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update credit";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Update Credit</h2>
        <p className="mb-2">
          User: {user.firstName} {user.lastName}
        </p>
        <p className="mb-4 text-sm text-gray-600">Email: {user.email}</p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="number"
          className="w-full border p-2 rounded mb-2"
          placeholder="Enter credit amount"
          value={String(amount)}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={loading}
          maxLength={1000}
          minLength={1}
        />
        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Reason for adjustment (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
