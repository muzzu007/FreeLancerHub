import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAdminUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
} from "lucide-react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const [filters, setFilters] = useState({
    role: "",
    active: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers({ ...filters, page });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load users");
        return;
      }

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadUsers(1);
  };

  const handleClearFilters = () => {
    setFilters({
      role: "",
      active: "",
      search: "",
      page: 1,
      limit: 10,
    });
    loadUsers(1);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${currentStatus ? "suspend" : "activate"} this user?`
    );
    if (!confirmed) return;

    try {
      const response = await updateUserStatus(userId, !currentStatus);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to update user status");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );

      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    const confirmed = window.confirm(`Change role to ${newRole}?`);
    if (!confirmed) return;

    try {
      const response = await updateUserRole(userId, newRole);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await deleteUser(userId);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to delete user");
        return;
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users size={24} className="text-[#635bff]" />
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {pagination.totalUsers} total
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
          />
        </div>
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={filters.active}
          onChange={(e) => handleFilterChange("active", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Suspended</option>
        </select>
        <button
          onClick={handleApplyFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
        >
          <Search size={18} />
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          <RefreshCw size={18} />
          Clear
        </button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white text-sm"
                      >
                        <option value="client">Client</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? <UserCheck size={14} /> : <UserX size={14} />}
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                            user.isActive
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.isActive ? "Suspend" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} users)
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => loadUsers(pagination.currentPage - 1)}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => loadUsers(pagination.currentPage + 1)}
                className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;