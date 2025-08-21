// function DangerZone() {
// const currentUserRole = localStorage.getItem("userRole");
//   const isSuperAdmin = currentUserRole === "super_admin";
//   const isAdmin = currentUserRole === "admin";
//   const isMarketing = currentUserRole === "marketing";
//     const isDeveloper = currentUserRole === "developer";
//     const canAccessDangerZone = isSuperAdmin || isAdmin;
    
//     const handleSuspendUser = async () => {
//     if (!canAccessDangerZone) {
//       showMessage("Only admins and super admins can suspend users", "warning");
//       return;
//     }

//     if (
//       !window.confirm(
//         `Are you sure you want to suspend ${user.firstName} ${user.lastName}?`
//       )
//     ) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`/api/users/${user.id}/suspend`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         showMessage("User suspended successfully", "success");
//       } else {
//         throw new Error("Failed to suspend user");
//       }
//     } catch (error) {
//       showMessage("Failed to suspend user", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivateUser = async () => {
//     if (!canAccessDangerZone) {
//       showMessage("Only admins and super admins can activate users", "warning");
//       return;
//     }

//     if (
//       !window.confirm(
//         `Are you sure you want to activate ${user.firstName} ${user.lastName}?`
//       )
//     ) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`/api/users/${user.id}/activate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         showMessage("User activated successfully", "success");
//       } else {
//         throw new Error("Failed to activate user");
//       }
//     } catch (error) {
//       showMessage("Failed to activate user", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async () => {
//     if (!isSuperAdmin) {
//       showMessage("Only super admins can delete users", "warning");
//       return;
//     }

//     if (
//       !window.confirm(
//         `⚠️ DANGER: Are you sure you want to permanently DELETE ${user.firstName} ${user.lastName}?\n\nThis action cannot be undone and will remove all user data including:\n- Profile information\n- Calculation history\n- Food diary entries\n\nType "DELETE" to confirm this action.`
//       )
//     ) {
//       return;
//     }

//     // Double confirmation for delete
//     const confirmation = window.prompt(
//       'Type "DELETE" to confirm user deletion:'
//     );
//     if (confirmation !== "DELETE") {
//       showMessage("User deletion cancelled", "warning");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`/api/users/${user.id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         showMessage("User deleted successfully", "success");
//         setTimeout(() => onClose(), 1500);
//       } else {
//         throw new Error("Failed to delete user");
//       }
//     } catch (error) {
//       showMessage("Failed to delete user", "error");
//     } finally {
//       setLoading(false);
//     }
//     };
    
//   return (
//       <div>
//           {/* Danger Zone */}
//           {canAccessDangerZone && (
//             <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-red-700">
//                   User Management
//                 </h3>
//                 <span className="text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium">
//                   {isSuperAdmin ? "Super Admin" : "Admin"}
//                 </span>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button
//                   onClick={handleSuspendUser}
//                   disabled={loading || !user.verified}
//                   className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
//                     !user.verified
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-red-600 text-white hover:bg-red-700 shadow-lg"
//                   }`}
//                 >
//                   {loading ? "Processing..." : "Suspend User"}
//                 </button>
//                 <button
//                   onClick={handleActivateUser}
//                   disabled={loading || user.verified}
//                   className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
//                     user.verified
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
//                   }`}
//                 >
//                   {loading ? "Processing..." : "Activate User"}
//                 </button>
//                 <button
//                   onClick={handleDeleteUser}
//                   disabled={loading || !isSuperAdmin}
//                   className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
//                     !isSuperAdmin
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
//                       : "border-2 border-red-600 text-red-600 hover:bg-red-50 shadow-lg"
//                   }`}
//                   title={
//                     !isSuperAdmin ? "Only Super Admins can delete users" : ""
//                   }
//                 >
//                   {loading ? "Processing..." : "Delete User"}
//                 </button>
//               </div>
//               {!isSuperAdmin && (
//                 <p className="text-xs text-red-600 text-center mt-3 bg-red-100 p-2 rounded-lg">
//                   * User deletion requires Super Admin privileges
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//     </div>
//   )
// }

// export default DangerZone