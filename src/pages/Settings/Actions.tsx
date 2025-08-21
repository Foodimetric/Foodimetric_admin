import { FlameKindling, ShieldAlert, Trash2 } from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../utils";

export const Actions = () => {
  const isFirstDay = new Date().getDate() === 1;

  const resetStreak = async () => {
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

  const monthlyCredit = async () => {
    if (!isFirstDay) {
      alert(
        "⚠️ This action can only be performed on the 1st day of the month."
      );
      return;
    }

    const confirmReset = window.confirm(
      "⚠️ WARNING: This will reset all verified users' credits to 1000. Are you sure you want to continue?"
    );
    if (!confirmReset) return;

    const confirmationText = window.prompt(
      "⚠️ FINAL CONFIRMATION: Type 'RESET CREDITS' to proceed with this irreversible action:"
    );
    if (confirmationText !== "RESET CREDITS") {
      alert("Credit reset cancelled. Confirmation text did not match.");
      return;
    }

    const user_token = localStorage.getItem("authToken");
    if (!user_token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
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
    } catch (error) {
      console.error("Error resetting credits:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred while resetting credits.");
      }
    }
  };

  return (
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
          This action is <span className="font-bold">irreversible</span> and can
          only be used on the <b>1st day of the month</b>.
        </p>
        <button
          onClick={monthlyCredit}
          disabled={!isFirstDay}
          className={`${
            isFirstDay
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          } w-full py-3 px-4  text-white rounded-lg flex items-center justify-center gap-2 transition`}
        >
          <Trash2 size={18} /> Reset All User Credits to 1000
        </button>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
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
          className={`w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 `} 
        >
          <FlameKindling size={18} /> Reset Streak
        </button>
      </div>
    </div>
  );
};
