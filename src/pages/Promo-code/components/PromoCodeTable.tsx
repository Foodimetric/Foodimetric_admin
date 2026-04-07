import { PromoCode } from "../types/promoCode";

interface Props {
  promoCodes: PromoCode[];
}

export const PromoCodeTable = ({ promoCodes }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">All Promo Codes</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Code</th>
            <th className="text-left p-2">Assigned To</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Expiration</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((promo) => (
            <tr key={promo.id} className="border-b">
              <td className="p-2 font-mono text-blue-600">{promo.code}</td>
              <td className="p-2">{promo.assignedTo}</td>
              <td className="p-2 capitalize text-gray-700">{promo.status}</td>
              <td className="p-2">{promo.expirationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
