import { useState, useEffect, useMemo } from "react";
import {
  useTable,
  useSortBy,
  Column,
  TableState,
  UseSortByColumnProps,
  HeaderGroup,
} from "react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import { FOODIMETRIC_HOST_URL } from "../../../utils";

interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
  action: string;
  meta: Record<string, any>;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

// Extend the TableState interface to include sortBy
interface TableStateWithSortBy<D extends object> extends TableState<D> {
  sortBy: Array<{
    id: string;
    desc: boolean;
  }>;
}

// Extend HeaderGroup to include sort properties
interface SortableHeaderGroup<D extends object>
  extends HeaderGroup<D>,
    UseSortByColumnProps<D> {}

export const ActivityLogTable = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(
        `${FOODIMETRIC_HOST_URL}/admin/activity/logs`,
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
        throw new Error(
          errorData?.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success && result.logs) {
        setLogs(result.logs);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch activity logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const formatMeta = (meta: Record<string, any>) => {
    if (!meta || Object.keys(meta).length === 0) {
      return <span className="text-gray-400 italic">No additional data</span>;
    }

    return (
      <div className="space-y-1">
        {Object.entries(meta).map(([key, value], index) => (
          <div key={index} className="text-xs">
            <span className="font-medium text-gray-600 capitalize">{key}:</span>{" "}
            <span className="text-gray-800 break-words">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "super admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "moderator":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes("login")) {
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
    if (action.toLowerCase().includes("logout")) {
      return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
    if (action.toLowerCase().includes("delete")) {
      return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
    }
    if (action.toLowerCase().includes("create")) {
      return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
    }
    if (
      action.toLowerCase().includes("update") ||
      action.toLowerCase().includes("credit")
    ) {
      return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
    }
    return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
  };

  const columns: Column<ActivityLog>[] = useMemo(
    () => [
      {
        Header: () => (
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <UserIcon size={16} />
            User
          </div>
        ),
        accessor: "user",
        Cell: ({ value }) => (
          <div className="py-2">
            <div className="font-medium text-gray-900">{value.name}</div>
            <div className="text-sm text-gray-500">{value.email}</div>
          </div>
        ),
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(
              value
            )}`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ value }) => (
          <div className="flex items-center gap-3">
            {getActionIcon(value)}
            <span className="text-sm text-gray-800 font-medium">{value}</span>
          </div>
        ),
      },
      {
        Header: "Details",
        accessor: "meta",
        Cell: ({ value }) => (
          <div className="py-2 max-w-xs">{formatMeta(value)}</div>
        ),
        disableSortBy: true,
      },
      {
        Header: () => (
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <ClockIcon size={16} />
            Timestamp
          </div>
        ),
        accessor: "timestamp",
        Cell: ({ value }) => {
          const { date, time } = formatTimestamp(value);
          return (
            <div className="text-sm">
              <div className="font-medium text-gray-900">{date}</div>
              <div className="text-gray-500">{time}</div>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: logs,
        initialState: {
          sortBy: [
            {
              id: "timestamp",
              desc: true,
            },
          ],
        } as Partial<TableStateWithSortBy<ActivityLog>>,
      },
      useSortBy
    );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track all system activities and changes
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">
              Loading activity logs...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track all system activities and changes
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchActivityLogs}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track all system activities and changes
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{logs.length}</span>
            <span>total entries</span>
          </div>
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Activity Found
          </h3>
          <p className="text-sm text-gray-500">
            There are no activity logs to display at this time.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table {...getTableProps()} className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column) => {
                      const sortableColumn =
                        column as SortableHeaderGroup<ActivityLog>;
                      return (
                        <th
                          {...column.getHeaderProps(
                            sortableColumn.getSortByToggleProps?.()
                          )}
                          key={column.id}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {column.render("Header")}
                            {sortableColumn.canSort && (
                              <span className="flex flex-col">
                                {sortableColumn.isSorted ? (
                                  sortableColumn.isSortedDesc ? (
                                    <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                                  ) : (
                                    <ChevronUpIcon className="h-3 w-3 text-gray-400" />
                                  )
                                ) : (
                                  <div className="h-3 w-3"></div>
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
