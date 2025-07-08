import { useActivityLog } from "../context/ActivityLogContext";

export const ActivityLogTable = () => {
  const { logs } = useActivityLog();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Activity Logs</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Action</th>
            <th className="text-left p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b">
              <td className="p-2 font-medium text-gray-800">{log.user}</td>
              <td className="p-2 text-gray-700">{log.action}</td>
              <td className="p-2 text-gray-500 text-xs">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
