import { useEffect, useState } from "react";
import { SkeletonBox } from "../../components/SkeletonBox";
import { FOODIMETRIC_HOST_URL } from "../../utils";

interface ChatUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  totalPrompts: number;
  lastUsageDate: string;
  chats: string[];
}

const ITEMS_PER_PAGE = 9; 

export const AIChatDashboard = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const user_token = localStorage.getItem("authToken");
        if (!user_token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`${FOODIMETRIC_HOST_URL}/admin/messages`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        const messages = data.messages || [];

        const userMessagesMap = new Map();

        messages.forEach((message: any) => {
          const userId = message.user_id;
          if (!userMessagesMap.has(userId)) {
            userMessagesMap.set(userId, {
              id: userId,
              email: `user-${userId.slice(-8)}@example.com`, 
              firstName: `User`,
              lastName: userId.slice(-4), 
              totalPrompts: 0,
              lastUsageDate: message.createdAt,
              chats: [],
            });
          }

          const userEntry = userMessagesMap.get(userId);
          userEntry.totalPrompts += 1;
          userEntry.chats.push(message.text);

          if (new Date(message.createdAt) > new Date(userEntry.lastUsageDate)) {
            userEntry.lastUsageDate = message.createdAt;
          }
        });

        const mappedUsers = Array.from(userMessagesMap.values());

        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch messages"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // const handleCreateUser = (e: React.FormEvent) => {
  //   e.preventDefault();
  // };

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

  const exportMessages = async () => {
    try {
      const user_token = localStorage.getItem("authToken");
      if (!user_token) {
        alert("No authentication token found. Please log in.");
        return;
      }

      const dataToExport = JSON.stringify(filteredUsers, null, 2);
      const blob = new Blob([dataToExport], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-chat-messages-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert("Messages exported successfully!");
    } catch (error) {
      console.error("Error exporting messages:", error);
      alert("Failed to export messages. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">AI Chats</h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Messages
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">AI Chats</h2>
        <button
          onClick={exportMessages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
        >
          Export Messages
        </button>
      </div>

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
        <div className="text-sm text-gray-600">
          Total Users: {filteredUsers.length}
        </div>
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
                    <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      Total Prompts: {user.totalPrompts}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last Used:{" "}
                      {new Date(user.lastUsageDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Chats
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Show message when no users found */}
          {paginatedUsers.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No users found matching your search."
                : "No chat data available."}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Chat Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] p-6 rounded-xl shadow-xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Chats by {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedUser.chats.length > 0 ? (
                selectedUser.chats.map((chat, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 text-sm border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-700">
                        Message {idx + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-800">{chat}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No chat messages available for this user.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
