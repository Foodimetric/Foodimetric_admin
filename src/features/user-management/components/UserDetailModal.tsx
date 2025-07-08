import { User } from "../types/user";

interface Props {
  user: User;
  onClose: () => void;
}

export const UserDetailModal = ({ user, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">User Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          <p>
            <strong>Foodipoints:</strong> {user.foodiPoints} / 1000
          </p>
          <p>
            <strong>Subscription Expiry:</strong> {user.expirationDate}
          </p>
          <p>
            <strong>Last Active:</strong> {user.lastLogin}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
