import { Users, NotebookText, Ruler, LineChart } from "lucide-react";

const cards = [
  {
    label: "Anthropometric Stats (Weekly)",
    value: 19,
    icon: <LineChart className="text-sky-700" size={24} />,
    color: "bg-sky-100",
    bg: "bg-sky-50",
  },
  {
    label: "Total Food Diary Logs",
    value: 47,
    icon: <NotebookText className="text-violet-700" size={24} />,
    color: "bg-violet-100",
    bg: "bg-violet-50",
  },
  {
    label: "Total Users",
    value: 1010,
    icon: <Users className="text-emerald-700" size={24} />,
    color: "bg-emerald-100",
    bg: "bg-emerald-50",
  },
  {
    label: "Total Anthropometric",
    value: 2054,
    icon: <Ruler className="text-amber-700" size={24} />,
    color: "bg-amber-100",
    bg: "bg-amber-50",
  },
  // {
  //   label: "Top Meal",
  //   value: "Jollof Rice",
  //   icon: <ChefHat className="text-pink-700" size={24} />,
  //   color: "bg-pink-100",
  //   bg: "bg-pink-50",
  // },
];

export const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition1`}
        >
          <div className={`p-3 rounded-full w-fit ${card.color}`}>{card.icon}</div>
          <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
};
