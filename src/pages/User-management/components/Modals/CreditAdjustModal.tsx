import { useState } from "react";
import toast from "react-hot-toast";
import { User } from "../../types/user";
import { FOODIMETRIC_HOST_URL } from "../../../../utils";
import { useAnalytics } from "../../../../contexts/AnalyticsContext";
import { useActivityLog } from "../../../Activity-log/context/ActivityLogContext";

interface Props {
  user: User;
  onClose: () => void;
}

export const CreditAdjustModal = ({ user, onClose }: Props) => {
  const { refetch } = useAnalytics();
  const { logDestructiveAction } = useActivityLog();
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate amount
    if (!amount || amount <= 0 || amount > 1000) {
      toast.error("Please enter a valid amount between 1 and 1000");
      return;
    }

    const actionMessage = `Credited ${amount} to user ${user.firstName} ${user.lastName} (${user.email})`;

    logDestructiveAction(actionMessage, async () => {
      await performCreditUpdate();
    });
  };

  const performCreditUpdate = async () => {
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
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      await refetch();
      toast.success(
        `Successfully credited ${amount} to ${user.firstName} ${user.lastName}`,
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setAmount(null);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setAmount(numValue);
      }
    }
  };

  return (
    <>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Amount (1-1000)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Enter credit amount"
              value={amount || ""}
              onChange={handleAmountChange}
              disabled={loading}
              min={1}
              max={1000}
            />
            {amount !== null && (amount <= 0 || amount > 1000) && (
              <p className="text-red-500 text-sm mt-1">
                Amount must be between 1 and 1000
              </p>
            )}
          </div>

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
              disabled={loading || !amount || amount <= 0 || amount > 1000}
            >
              {loading ? "Updating..." : "Credit User"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
