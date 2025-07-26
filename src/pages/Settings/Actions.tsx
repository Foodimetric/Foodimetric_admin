import { RefreshCcw, ShieldAlert, Trash2 } from "lucide-react";

export const Actions = () => (
  <div className="">
    <div className="bg-white rounded-xl shadow p-6 space-y-5">
      <h2 className="text-xl font-semibold text-gray-800">Security Actions</h2>
      <button className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition">
        <RefreshCcw size={18} /> Refresh All Tokens
      </button>
    </div>

    <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
        <ShieldAlert className="text-red-600" /> Danger Zone
      </h2>
      <p className="text-sm text-red-600 leading-relaxed">
        Clicking this button will reset all verified users’ credits to{" "}
        <b>1000</b>
        .
        <br />
        This action is <span className="font-bold">irreversible</span> and can
        only be used on the <b>1st day of the month</b>.
      </p>
      <button className="w-full py-3 px-4 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition">
        <Trash2 size={18} /> Reset All User Credits to 1000
      </button>
    </div>
  </div>
);
