// import { useState } from "react";

// export const AnalyticsFilters = ({
//   onFilter,
// }: {
//   onFilter: (role: string) => void;
// }) => {
//   const [role, setRole] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRole = e.target.value;
//     setRole(selectedRole);
//     onFilter(selectedRole);
//   };

//   return (
//     <div className="flex justify-end mb-6">
//       <select
//         value={role}
//         onChange={handleChange}
//         className="border rounded px-4 py-2 text-sm text-gray-700"
//       >
//         <option value="">All Roles</option>
//         <option value="dietitian">Dietitian/Nutritionist</option>
//         <option value="client">Lecturer/Researcher</option>
//         <option value="student">Student</option>
//         <option value="others">Others</option>
//       </select>
//     </div>
//   );
// };
