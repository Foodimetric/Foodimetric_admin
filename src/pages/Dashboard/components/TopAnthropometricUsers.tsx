import { useState } from "react";

const users = Array.from({ length: 30 }, (_, index) => ({
  rank: index + 1,
  user: `User ${index + 1}`,
  usage: Math.floor(Math.random() * 300) + 20,
  lastActive: `0${(index % 9) + 1}/0${(index % 6) + 5}/2025`,
}));

const USERS_PER_PAGE = 10;

const TopAnthropometricUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Top Anthropometric Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Rank
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                User
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Usage Count
              </th>
              <th className="border border-gray-200 p-3 text-left text-sm font-medium">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(({ rank, user, usage, lastActive }) => (
              <tr key={rank} className="even:bg-gray-50">
                <td className="border border-gray-200 p-3 text-sm">{rank}</td>
                <td className="border border-gray-200 p-3 text-sm capitalize">
                  {user}
                </td>
                <td className="border border-gray-200 p-3 text-sm">{usage}</td>
                <td className="border border-gray-200 p-3 text-sm">
                  {lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopAnthropometricUsers;
