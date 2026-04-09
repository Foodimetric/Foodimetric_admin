import { Search } from "lucide-react";
import clsx from "clsx";

type StatusFilter = "all" | "published" | "draft";

interface FilterCounts {
  all: number;
  published: number;
  draft: number;
}

interface ResourceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
  counts: FilterCounts;
  activeTab: "articles" | "courses";
}

const ResourceFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  counts,
  activeTab,
}: ResourceFiltersProps) => (
  <div className="flex items-center gap-3 flex-wrap">
    {/* Search */}
    <div className="relative flex-1 min-w-[200px] max-w-sm">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Search ${activeTab}...`}
      />
    </div>

    {/* Status pills */}
    <div className="flex items-center gap-1.5">
      {(["all", "published", "draft"] as const).map((s) => (
        <button
          key={s}
          onClick={() => onStatusChange(s)}
          className={clsx(
            "text-xs px-3 py-2 rounded-lg border transition-colors capitalize",
            statusFilter === s
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200 text-gray-500 hover:bg-gray-50",
          )}
        >
          {s} <span className="opacity-70">({counts[s]})</span>
        </button>
      ))}
    </div>
  </div>
);

export default ResourceFilters;
