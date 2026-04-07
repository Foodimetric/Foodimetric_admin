import { User } from "../types/user";

// interface Props {
//   user: User;
//   onViewDetails: (user: User) => void;
//   onAdjustPoints: (user: User) => void;
// }

export const UserOptionsMenu = ({
  user,
  isOpen,
  onToggle,
  onViewDetails,
  onAdjustPoints,
}: {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetails: (user: User) => void;
  onAdjustPoints: (user: User) => void;
}) => {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="px-3 py-1 bg-gray-100 rounded"
      >
        ⋮
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-40 z-10 border text-sm">
          <button
            onClick={() => {
              onViewDetails(user);
              onToggle();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            View Details
          </button>
          <button
            onClick={() => {
              onAdjustPoints(user);
              onToggle();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Adjust Points
          </button>
        </div>
      )}
    </div>
  );
};
