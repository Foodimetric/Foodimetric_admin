const users = [
  { rank: 1, user: "folake sowonoye", usage: 51, lastActive: "18/07/2025" },
  { rank: 2, user: "Funmi Oluwadairo", usage: 30, lastActive: "17/06/2025" },
  { rank: 3, user: "Ayomide Ademola", usage: 23, lastActive: "14/07/2025" },
  { rank: 4, user: "Yussuf Isiaq", usage: 22, lastActive: "05/07/2025" },
  { rank: 5, user: "Barakat Olaniyi", usage: 11, lastActive: "19/06/2025" },
  { rank: 6, user: "Temitope Ayokunle", usage: 10, lastActive: "25/06/2025" },
  { rank: 7, user: "Seyi Oladipo", usage: 10, lastActive: "07/05/2025" },
  { rank: 8, user: "oluwole boluwatife", usage: 9, lastActive: "15/07/2025" },
  { rank: 9, user: "Labbie Isiaq", usage: 9, lastActive: "30/06/2025" },
  { rank: 10, user: "Olusola Ibiyemi", usage: 8, lastActive: "16/06/2025" },
];

const TopUsersTable = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Top Users by Engagement</h2>
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
            {users.map(({ rank, user, usage, lastActive }) => (
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
    </div>
  );
};

export default TopUsersTable;
