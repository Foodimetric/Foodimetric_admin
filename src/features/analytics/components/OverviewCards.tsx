const cards = [
  { label: "Total Users", value: 1523 },
  { label: "Top Meal", value: "Jollof Rice" },
  { label: "Logged-in Users", value: 432 },
];

export const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
        >
          <h3 className="text-sm text-gray-500">{card.label}</h3>
          <p className="text-xl font-bold mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
};
