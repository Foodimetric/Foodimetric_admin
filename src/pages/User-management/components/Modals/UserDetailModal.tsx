import { User } from "../../types/user";
import { X } from "lucide-react";

interface Props {
  user: User;
  onClose: () => void;
}

const getRoleName = (category: number) => {
  switch (category) {
    case 1:
      return "Lecturer / Researcher";
    case 2:
      return "Registered Dietitian / Clinical Nutritionist";
    case 3:
      return "Nutrition Student";
    default:
      return "Others";
  }
};

export const UserDetailModal = ({ user, onClose }: Props) => {
  const bmiData = {
    date: "June 7, 2025 03:01:16 PM",
    result: "24.22 kg/m²",
    weight: "70 kg",
    height: "1.7 m",
    formula: "BMI calculated using weight in kg and height in m",
  };

  const foodDiary = [
    {
      date: "July 20, 2025",
      time: "08:15 AM",
      food: "Oatmeal with banana and nuts",
      quantity: "1 bowl",
      note: "Felt light and energized after meal",
    },
    {
      date: "July 20, 2025",
      time: "01:00 PM",
      food: "Grilled chicken with mixed veggies",
      quantity: "1 plate",
      note: "Very filling and satisfying",
    },
    {
      date: "July 20, 2025",
      time: "07:30 PM",
      food: "Avocado toast with eggs",
      quantity: "2 slices",
      note: "Simple and delicious evening meal",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6 relative">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-600 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {getRoleName(user.category)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Google ID:</strong> {user.googleId || "N/A"}
                </p>
                <p>
                  <strong>Credits:</strong> {user.credits} points
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {user.verified ? `✅ Yes` : "❌ No"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Last Active:</strong>{" "}
                  {user.lastUsageDate || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* BMI Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Latest BMI Result
            </h3>
            <div className="bg-green-50 p-4 rounded-lg space-y-1 text-sm">
              <p>
                <strong>Date & Time:</strong> {bmiData.date}
              </p>
              <p>
                <strong>Result:</strong> {bmiData.result}
              </p>
              <p>
                <strong>Weight:</strong> {bmiData.weight}
              </p>
              <p>
                <strong>Height:</strong> {bmiData.height}
              </p>
              <p className="text-xs italic text-gray-600">{bmiData.formula}</p>
            </div>
          </div>

          {/* Food Diary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Recent Food Diary
            </h3>
            <div className="space-y-3">
              {foodDiary.map((entry, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg text-sm">
                  <p>
                    <strong>Date:</strong> {entry.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {entry.time}
                  </p>
                  <p>
                    <strong>Food Eaten:</strong> {entry.food}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {entry.quantity}
                  </p>
                  <p>
                    <strong>Meal Experience:</strong> {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-700 border-b pb-2">
              Danger Zone
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm">
                Suspend User
              </button>
              <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm">
                Activate User
              </button>
              <button className="border border-red-600 text-red-600 py-2 rounded hover:bg-red-100 text-sm">
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
