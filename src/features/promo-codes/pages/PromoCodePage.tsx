import { useState } from "react";
import { PromoCodeGenerator } from "../components/PromoCodeGenerator";
import { PromoCodeTable } from "../components/PromoCodeTable";
import { PromoCode } from "../types/promoCode";

export const PromoCodePage = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  const addPromoCode = (newPromo: PromoCode) => {
    setPromoCodes((prev) => [newPromo, ...prev]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Promo Code Management</h1>
      <PromoCodeGenerator onGenerate={addPromoCode} />
      <PromoCodeTable promoCodes={promoCodes} />
    </div>
  );
};
