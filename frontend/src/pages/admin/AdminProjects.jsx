import { useEffect, useState } from "react";
import {
    getAdminProjects,
    deleteProjectAsAdmin
} from "../../services/adminService";

function AdminProjects() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProjects: 0
    });

    const [filters, setFilters] = useState({
        status: "",
        search: "",
        page: 1,
        limit: 10
    });

    const loadProjects = async (page = 1) => {

        try {

            setLoading(true);
            setError("");

            const response = await getAdminProjects({ ...filters, page });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to load projects");
                return;
            }

            setProjects(data.projects);
            setPagination(data.pagination);

        } catch (error) {

            console.error(error);
            setError("Unable to reach server");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadProjects(1);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        loadProjects(1);
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            search: "",
            page: 1,
            limit: 10
        });
        loadProjects(1);
    };

    const handleDeleteProject = async (projectId) => {
        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (!confirmed) return;

        try {
            const response = await deleteProjectAsAdmin(projectId);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to delete project");
                return;
            }

            setProjects(prev => prev.filter(p => p._id !== projectId));
            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    if (loading && projects.length === 0) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Manage Projects</h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={handleApplyFilters}>Apply</button>
                <button onClick={handleClearFilters}>Clear</button>
            </div>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                                <th>Title</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Client</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td>{project.title}</td>
                                    <td>₹{project.budget}</td>
                                    <td>{project.status}</td>
                                    <td>{project.client?.name || "Unknown"}</td>
                                    <td>
                                        <button onClick={() => handleDeleteProject(project._id)} style={{ color: "red" }}>
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
                            onClick={() => loadProjects(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span style={{ margin: "0 12px" }}>
                            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProjects} projects)
                        </span>
                        <button
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => loadProjects(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminProjects;