import { FlameKindling, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils";
import { useActivityLog } from "../Activity-log/context/ActivityLogContext";

export const Actions = () => {
  const isFirstDay = new Date().getDate() === 1;
  const [creditResetModalOpen, setCreditResetModalOpen] = useState(false);
  const [creditConfirmationWord, setCreditConfirmationWord] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);
  const { logDestructiveAction } = useActivityLog();

  const REQUIRED_CREDIT_CONFIRMATION_WORD = "RESET CREDITS";

  const resetStreak = () => {
    logDestructiveAction("Reset user streaks", async () => {
      await performStreakReset();
    });
  };

  const performStreakReset = async () => {
    const user_token = localStorage.getItem("authToken");
    if (!user_token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/reset-streaks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Something went wrong");
      }

      const data = await response.json();
      alert(data.message || "Streak reset successfully.");
    } catch (error) {
      console.error("Error resetting streaks:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred while resetting streaks.");
      }
    }
  };

  const monthlyCredit = () => {
    if (!isFirstDay) {
      alert(
        "⚠️ This action can only be performed on the 1st day of the month."
      );
      return;
    }

    logDestructiveAction("Reset all user credits to 1000", async () => {
      setCreditResetModalOpen(true);
      setCreditConfirmationWord("");
      setCreditError(null);
    });
  };

  const handleConfirmCreditReset = async () => {
    if (creditConfirmationWord !== REQUIRED_CREDIT_CONFIRMATION_WORD) {
      setCreditError(
        `Please type '${REQUIRED_CREDIT_CONFIRMATION_WORD}' to proceed`
      );
      return;
    }

    const user_token = localStorage.getItem("authToken");
    if (!user_token) {
      setCreditError("No authentication token found. Please log in.");
      return;
    }

    try {
      setCreditLoading(true);
      setCreditError(null);

      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/dashboard/reset-credits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Something went wrong");
      }

      const data = await response.json();
      alert(data.message || "Credits reset successfully.");
      setCreditResetModalOpen(false);
      setCreditConfirmationWord("");

    } catch (error) {
      console.error("Error resetting credits:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while resetting credits.";
      setCreditError(errorMessage);
    } finally {
      setCreditLoading(false);
    }
  };

  const handleCancelCreditReset = () => {
    setCreditResetModalOpen(false);
    setCreditConfirmationWord("");
    setCreditError(null);
  };

  return (
    <>
      <div className="">
        {/* <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Security Actions
          </h2>
          <button className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition">
            <RefreshCcw size={18} /> Refresh All Tokens
          </button>
        </div> */}

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <ShieldAlert className="text-red-600" /> Danger Zone
          </h2>
          <p className="text-sm text-red-600 leading-relaxed">
            Clicking this button will reset all verified users' credits to{" "}
            <b>1000</b>
            .
            <br />
            This action is <span className="font-bold">irreversible</span> and
            can only be used on the <b>1st day of the month</b>.
          </p>
          <button
            onClick={monthlyCredit}
            disabled={!isFirstDay}
            className={`${
              isFirstDay
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            } w-full py-3 px-4 text-white rounded-lg flex items-center justify-center gap-2 transition`}
          >
            <Trash2 size={18} /> Reset All User Credits to 1000
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 mt-10">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <ShieldAlert className="text-red-600" /> Reset Streaks
          </h2>
          <p className="text-sm text-red-600 leading-relaxed">
            <br />
            This action is to <span className="font-bold">reset</span> streak
            every <b>24 hours</b>.
          </p>
          <button
            onClick={resetStreak}
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <FlameKindling size={18} /> Reset Streak
          </button>
        </div>
      </div>

      {/* Credit Reset Confirmation Modal */}
      <Dialog
        open={creditResetModalOpen}
        onClose={handleCancelCreditReset}
        className="relative z-40" 
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={24} />
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Final Confirmation Required
                </Dialog.Title>
              </div>
              <button
                onClick={handleCancelCreditReset}
                className="text-gray-400 hover:text-gray-600"
                disabled={creditLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-red-100 border border-red-400 rounded-md mb-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ WARNING: This will reset all verified users' credits to
                  1000.
                </p>
                <p className="text-sm text-red-700 mt-1">
                  This action is <strong>irreversible</strong> and affects all
                  users.
                </p>
              </div>

              <p className="text-sm font-medium text-gray-800 mb-2">
                Type{" "}
                <span className="font-bold text-red-600">
                  {REQUIRED_CREDIT_CONFIRMATION_WORD}
                </span>{" "}
                to proceed:
              </p>

              <input
                type="text"
                value={creditConfirmationWord}
                onChange={(e) => setCreditConfirmationWord(e.target.value)}
                placeholder={`Type ${REQUIRED_CREDIT_CONFIRMATION_WORD}`}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={creditLoading}
                autoFocus
              />
            </div>

            {creditError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {creditError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelCreditReset}
                disabled={creditLoading}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreditReset}
                className={`px-4 py-2 text-sm text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  creditConfirmationWord !== REQUIRED_CREDIT_CONFIRMATION_WORD
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {creditLoading ? "Resetting..." : "Reset All Credits"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
