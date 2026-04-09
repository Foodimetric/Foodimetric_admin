import clsx from "clsx";

type Status = "published" | "draft";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={clsx(
      "text-xs px-2.5 py-1 rounded-full font-medium",
      status === "published"
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-amber-50 text-amber-700 border border-amber-200",
    )}
  >
    {status === "published" ? "Published" : "Draft"}
  </span>
);

export default StatusBadge;
