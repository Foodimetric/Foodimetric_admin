import { useState } from "react";
import toast from "react-hot-toast";
import { PromoCode } from "../types/promoCode";
import { useActivityLog } from "../../Activity-log/context/ActivityLogContext";

function generatePromoCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `FOODI-${code}`;
}

export const PromoCodeGenerator = ({
  onGenerate,
}: {
  onGenerate: (promo: PromoCode) => void;
}) => {
  const [email, setEmail] = useState("");
  const [expiration, setExpiration] = useState("");
  const { addLog } = useActivityLog();

  const handleGenerate = () => {
    if (!email || !expiration) {
      toast.error("Please provide both email and expiration date");
      return;
    }

    const code = generatePromoCode();
    const newPromo: PromoCode = {
      id: crypto.randomUUID(),
      code,
      assignedTo: email,
      status: "unused",
      expirationDate: expiration,
    };

    onGenerate(newPromo);
    addLog({
      user: "admin@foodimetric.com",
      action: `Generated promo code ${code} for ${email}`,
      timestamp: new Date().toISOString(),
    });
    toast.success(`Promo code ${code} generated for ${email}`);
    setEmail("");
    setExpiration("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Generate Promo Code</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="Assign to Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col">
          <label htmlFor="expiration" className="text-sm text-gray-600 mb-1">
            Expiration Date
          </label>
          <input
            id="expiration"
            type="date"
            className="border p-2 rounded"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
          />
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleGenerate}
      >
        Generate Code
      </button>
    </div>
  );
};
