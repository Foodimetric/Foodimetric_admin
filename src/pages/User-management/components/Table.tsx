import { useState, useMemo } from "react";
import { CreditAdjustModal } from "./Modals/CreditAdjustModal";
import { User } from "../types/user";
import { UserDetailModal } from "./Modals/UserDetailModal";
import { UserOptionsMenu } from "./UserOptionsMenu";
import { useAnalytics } from "../../../contexts/AnalyticsContext";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  HeaderGroup,
  UseSortByColumnProps,
  TableInstance,
  UseSortByState,
  UsePaginationInstanceProps,
  Row,
} from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface TableProps {
  data?: User[];
  searchTerm?: string;
  loading?: boolean;
  error?: string;
}

// Extend HeaderGroup to include sort properties
interface SortableHeaderGroup<D extends object>
  extends HeaderGroup<D>,
    UseSortByColumnProps<D> {}

// Define table instance type with sorting and pagination
type TableInstanceWithSortingAndPagination<D extends object> =
  TableInstance<D> &
    UseSortByState<D> &
    UsePaginationInstanceProps<D> & {
      page: Row<D>[];
      canPreviousPage: boolean;
      canNextPage: boolean;
      pageOptions: number[];
      pageCount: number;
      gotoPage: (page: number) => void;
      nextPage: () => void;
      previousPage: () => void;
      setPageSize: (size: number) => void;
      state: {
        pageIndex: number;
        pageSize: number;
        sortBy: Array<{ id: string; desc: boolean }>;
      };
    };

export const Table = ({
  data: propData,
  searchTerm = "",
  loading: propLoading,
  error: propError,
}: TableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Use analytics hook when no prop data is provided
  const { analytics, loading: hookLoading, error: hookError } = useAnalytics();

  // Use prop values if provided, otherwise use hook values
  const loading = propLoading !== undefined ? propLoading : hookLoading;
  const error = propError !== undefined ? propError : hookError;

  // Use prop data if provided, otherwise transform analytics data
  const data: User[] =
    propData ||
    analytics?.allUsers?.map((user: any) => ({
      id: String(user._id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      usage: user.usage,
      category: user.category,
      googleId: user.googleId,
      credits: user.credits,
      lastUsageDate: user.lastUsageDate
        ? new Date(user.lastUsageDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown",
      verified: user.isVerified,
      longestStreak: user.longestStreak,
      location: user.location,
      streak: user.streak,
      healthProfile: user.healthProfile,
      latestCalculation: user.latestCalculation,
      partnerDetails: user.partnerDetails,
      status: user.status,
      latestFoodLogs: user.latestFoodLogs,
      notifications: user.notifications,
      fcmTokens: user.fcmTokens,
    })) ||
    [];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter((user) =>
      searchTerm === ""
        ? true
        : [user.firstName, user.lastName, user.email]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const getRole = (category: number) => {
    switch (category) {
      case 1:
        return "Lecturer/Researcher";
      case 2:
        return "Dietitian/Clinical Nutritionist";
      case 3:
        return "Nutrition Student";
      default:
        return "Others";
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Columns for react-table
  const columns: Column<User>[] = useMemo(
    () => [
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => (
          <span className="font-medium text-blue-600">{value}</span>
        ),
      },
      {
        Header: "First Name",
        accessor: "firstName",
        Cell: ({ value }) => <span className="capitalize">{value}</span>,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        Cell: ({ value }) => <span className="capitalize">{value}</span>,
      },
      {
        Header: "Usage",
        accessor: "usage",
        Cell: ({ value }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value?.toLocaleString()}
          </span>
        ),
      },
      {
        Header: "Streak",
        accessor: "streak",
      },
      {
        Header: "Role",
        accessor: "category",
        Cell: ({ value }) => getRole(value),
      },
      {
        Header: "Google ID",
        accessor: "googleId",
        Cell: ({ value }) => (
          <span className="font-mono text-xs">{value || "N/A"}</span>
        ),
      },
      {
        Header: "Credits",
        accessor: "credits",
        Cell: ({ value }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              value > 500
                ? "bg-green-100 text-green-800"
                : value > 100
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value?.toLocaleString()}
          </span>
        ),
      },
      {
        Header: "Last Usage Date",
        accessor: "lastUsageDate",
        Cell: ({ value }) => <span className="text-gray-600">{value}</span>,
      },
      {
        Header: "Verified",
        accessor: "verified",
        Cell: ({ value }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Verified" : "Unverified"}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        disableSortBy: true,
        Cell: ({ row }) => (
          <UserOptionsMenu
            user={row.original}
            isOpen={openMenuId === row.original.id}
            onToggle={() => toggleMenu(row.original.id)}
            onViewDetails={setViewingUser}
            onAdjustPoints={setSelectedUser}
          />
        ),
      },
    ],
    [openMenuId]
  );

  // React Table instance with sorting and pagination
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
        sortBy: [
          {
            id: "credits",
            desc: true,
          },
        ],
      } as any,
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithSortingAndPagination<User>;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, pageIndex + 1 - delta);
      i <= Math.min(pageCount - 1, pageIndex + 1 + delta);
      i++
    ) {
      range.push(i);
    }

    if (pageIndex + 1 - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pageIndex + 1 + delta < pageCount - 1) {
      rangeWithDots.push("...", pageCount);
    } else if (pageCount > 1) {
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  if (!propData && loading) {
    return (
      <div className="p-4">
        <div className="min-w-full bg-white rounded-md shadow">
          <div className="animate-pulse">
            <div className="bg-gray-100 p-3">
              <div className="grid grid-cols-10 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            {[...Array(ITEMS_PER_PAGE)].map((_, rowIndex) => (
              <div key={rowIndex} className="border-t p-3">
                <div className="grid grid-cols-10 gap-4">
                  {[...Array(10)].map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="h-4 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!propData && error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading user data: {error}</p>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            {searchTerm
              ? `No users found matching "${searchTerm}"`
              : "No user data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with user count */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          User Management ({filteredData.length} users
          {searchTerm ? ` matching "${searchTerm}"` : ""})
        </h3>
        <div className="text-sm text-gray-600">
          Showing {pageIndex * pageSize + 1}-
          {Math.min((pageIndex + 1) * pageSize, filteredData.length)} of{" "}
          {filteredData.length}
        </div>
      </div>

      {/* React Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full bg-white rounded-md shadow text-xs"
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column) => {
                  const sortableColumn = column as SortableHeaderGroup<User>;
                  return (
                    <th
                      {...column.getHeaderProps(
                        sortableColumn.getSortByToggleProps?.()
                      )}
                      key={column.id}
                      className="p-3 font-semibold text-left cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-1">
                        {column.render("Header")}
                        {sortableColumn.canSort && (
                          <span>
                            {sortableColumn.isSorted ? (
                              sortableColumn.isSortedDesc ? (
                                <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                              ) : (
                                <ChevronUpIcon className="h-3 w-3 text-gray-400" />
                              )
                            ) : (
                              <div className="h-3 w-3" />
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
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="p-3 whitespace-nowrap"
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

      {/* Enhanced Pagination */}
      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2 sm:gap-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof pageNum === "number" && gotoPage(pageNum - 1)
                  }
                  disabled={pageNum === "..."}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-t border-b border-r border-gray-300 ${
                    pageNum === pageIndex + 1
                      ? "bg-blue-50 text-blue-600 border-blue-500"
                      : pageNum === "..."
                      ? "text-gray-400 cursor-default"
                      : "text-gray-500 bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border-t border-b border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>

          <div className="text-sm text-gray-700">
            Page {pageIndex + 1} of {pageOptions.length} • {filteredData.length}{" "}
            total users
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <CreditAdjustModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
};
