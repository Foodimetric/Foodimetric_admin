import { useEffect, useState } from "react";
import { SkeletonBox } from "../../components/SkeletonBox";
import { dummyUsers, ITEMS_PER_PAGE } from "../User-management/types/user";

interface ChatUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  totalPrompts: number;
  lastUsageDate: string;
  chats: string[];
}

export const AIChatDashboard = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const mappedUsers = dummyUsers.map((u) => ({
        ...u,
        totalPrompts: u.usage,
        chats: Array.from(
          { length: Math.floor(Math.random() * 5) + 1 },
          (_, i) => `Prompt ${i + 1} from ${u.firstName}`
        ),
      }));
      setUsers(mappedUsers);
      setLoading(false);
    }, 1000); 
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">AI Chats</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <SkeletonBox key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-2 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Total Prompts: {user.totalPrompts}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last Used: {user.lastUsageDate}
                    </p>
                  </div>
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Chats
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Chat Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative space-y-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold">
              Chats by {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedUser.chats.map((chat, idx) => (
                <div key={idx} className="bg-gray-100 rounded-md p-3 text-sm">
                  {chat}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
