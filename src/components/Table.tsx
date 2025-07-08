import { useState } from "react";
import { AccountStatusToggle } from "../features/user-management/components/AccountStatusToggle";
import { CreditAdjustModal } from "../features/user-management/components/CreditAdjustModal";
import { User } from "../features/user-management/types/user";
import { UserDetailModal } from "../features/user-management/components/UserDetailModal";
import { UserOptionsMenu } from "../features/user-management/components/UserOptionsMenu";

interface TableProps {
  data: User[];
}

export const Table = ({ data }: TableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  return (
    <>
      <table className="min-w-full bg-white rounded-md shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3">
                <AccountStatusToggle user={user} />
              </td>
              <td className="p-3 flex items-center gap-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
                >
                  Adjust Points
                </button>
                <UserOptionsMenu user={user} onViewDetails={setViewingUser} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </>
  );
};

