import { SearchBar } from "../../../components/SearchBar";
import { Table } from "../../../components/Table";
import { useUserData } from "../hooks/useUserData";

export const UserManagementPage = () => {
  const { users, isLoading } = useUserData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User & Account Management</h1>
      <SearchBar placeholder="Search users by name or email..." />
      {isLoading ? <p>Loading users...</p> : <Table data={users} />}
    </div>
  );
};
