import { useState, useMemo } from "react";
import { SearchBar } from "../../../components/SearchBar";
import { Table } from "../../../components/Table";
import { useUserData } from "../hooks/useUserData";
import { dummyUsers } from "../types/user";

export const UserManagementPage = () => {
  const { isLoading } = useUserData();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredUsers = useMemo(() => {
    return dummyUsers.filter((user) =>
      [user.firstName, user.lastName, user.email]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [searchTerm]);

  const exportCSV = () => {
    if (filteredUsers.length === 0) return alert("No data to export.");
    const headers = [
      "Email,First Name,Last Name,Usage,Role,Google ID,Credits,Last Usage Date,Verified",
    ];
    const rows = filteredUsers.map(
      (user) =>
        `${user.email},${user.firstName},${user.lastName},${user.usage},${
          user.category
        },${user.googleId},${user.credits},${user.lastUsageDate},${
          user.verified ? "Yes" : "No"
        }`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMessages = () => {
    alert("Message export feature triggered!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User & Account Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={exportCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={exportMessages}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
          >
            Export Messages
          </button>
        </div>
      </div>

      <SearchBar
        placeholder="Search users by name or email..."
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-12 bg-gray-200 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="mt-8 text-center text-gray-500 font-medium">
          No users found.
        </div>
      ) : (
        <Table data={filteredUsers} />
      )}
    </div>
  );
};
