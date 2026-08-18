import { useEffect, useState } from "react";
import {
    getAdminUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser
} from "../../services/adminService";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0
    });

    const [filters, setFilters] = useState({
        role: "",
        active: "",
        search: "",
        page: 1,
        limit: 10
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
        setFilters(prev => ({ ...prev, [key]: value }));
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
            limit: 10
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
                alert(data.message || "Unable to update user status");
                return;
            }

            setUsers(prev => prev.map(user =>
                user._id === userId ? { ...user, isActive: !currentStatus } : user
            ));

            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        const confirmed = window.confirm(`Change role to ${newRole}?`);
        if (!confirmed) return;

        try {
            const response = await updateUserRole(userId, newRole);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to update role");
                return;
            }

            setUsers(prev => prev.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));

            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!confirmed) return;

        try {
            const response = await deleteUser(userId);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to delete user");
                return;
            }

            setUsers(prev => prev.filter(user => user._id !== userId));
            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    if (loading && users.length === 0) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Manage Users</h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="client">Client</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={filters.active}
                    onChange={(e) => handleFilterChange("active", e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                </select>
                <button onClick={handleApplyFilters}>Apply</button>
                <button onClick={handleClearFilters}>Clear</button>
            </div>

            {/* User Table */}
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user._id, e.target.value)}
                                            style={{ padding: "4px" }}
                                        >
                                            <option value="client">Client</option>
                                            <option value="freelancer">Freelancer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span style={{ color: user.isActive ? "green" : "red" }}>
                                            {user.isActive ? "Active" : "Suspended"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                                            style={{ marginRight: "8px" }}
                                        >
                                            {user.isActive ? "Suspend" : "Activate"}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user._id)} style={{ color: "red" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ marginTop: "16px" }}>
                        <button
                            disabled={pagination.currentPage <= 1}
                            onClick={() => loadUsers(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span style={{ margin: "0 12px" }}>
                            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} users)
                        </span>
                        <button
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => loadUsers(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminUsers;