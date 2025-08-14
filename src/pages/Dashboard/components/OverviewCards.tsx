import { Users, NotebookText, Ruler, LineChart } from "lucide-react";
import { useAnalytics } from "../../Hooks/useAnalytics";

export const OverviewCards = () => {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-sm p-5 flex flex-col gap-4 animate-pulse"
          >
            <div className="p-3 rounded-full w-12 h-12 bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="col-span-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Anthropometric Stats (Weekly)",
      value: analytics.anthropometricStats?.weekly || 0,
      icon: <LineChart className="text-sky-700" size={24} />,
      color: "bg-sky-100",
      bg: "bg-sky-50",
    },
    {
      label: "Total Food Diary Logs",
      value: analytics.totalFoodDiaryLogs || 0,
      icon: <NotebookText className="text-violet-700" size={24} />,
      color: "bg-violet-100",
      bg: "bg-violet-50",
    },
    {
      label: "Total Users",
      value: analytics.totalUsers || 0,
      icon: <Users className="text-emerald-700" size={24} />,
      color: "bg-emerald-100",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Anthropometric",
      value: analytics.totalAnthropometricCalculations || 0,
      icon: <Ruler className="text-amber-700" size={24} />,
      color: "bg-amber-100",
      bg: "bg-amber-50",
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200`}
        >
          <div className={`p-3 rounded-full w-fit ${card.color}`}>
            {card.icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
          <p
            className="text-2xl font-bold text-gray-800"
            title={card.value.toString()}
          >
            {formatNumber(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
};
