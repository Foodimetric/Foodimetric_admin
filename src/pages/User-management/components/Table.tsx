import { useState } from "react";
import { CreditAdjustModal } from "./Modals/CreditAdjustModal";
import { User } from "../types/user";
import { UserDetailModal } from "./Modals/UserDetailModal";
import { UserOptionsMenu } from "./UserOptionsMenu";

// interface TableProps {
//   data: User[];
// }

const ITEMS_PER_PAGE = 10;

export const Table = ({ data }: { data: User[] }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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

  return (
    <div className="p-4">
      <table className="min-w-full bg-white rounded-md shadow text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Email</th>
            <th className="p-3">First Name</th>
            <th className="p-3">Last Name</th>
            <th className="p-3">Usage</th>
            <th className="p-3">Role</th>
            <th className="p-3">Google ID</th>
            <th className="p-3">Credits</th>
            <th className="p-3">Last Usage Date</th>
            <th className="p-3">Verified</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.firstName}</td>
              <td className="p-3 capitalize">{user.lastName}</td>
              <td className="p-3">{user.usage}</td>
              <td className="p-3">{getRole(user.category)}</td>
              <td className="p-3">{user.googleId}</td>
              <td className="p-3">{user.credits}</td>
              <td className="p-3">{user.lastUsageDate}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.verified ? "Yes" : "No"}
                </span>
              </td>
              <td className="p-3">
                <UserOptionsMenu
                  user={user}
                  isOpen={openMenuId === user.id}
                  onToggle={() => toggleMenu(user.id)}
                  onViewDetails={setViewingUser}
                  onAdjustPoints={setSelectedUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>

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
