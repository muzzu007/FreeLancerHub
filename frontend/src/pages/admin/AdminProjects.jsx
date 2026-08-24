import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAdminProjects,
  deleteProjectAsAdmin,
} from "../../services/adminService";
import { Search, FolderOpen, Trash2, RefreshCw } from "lucide-react";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
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
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadProjects(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      search: "",
      page: 1,
      limit: 10,
    });
    loadProjects(1);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    try {
      const response = await deleteProjectAsAdmin(projectId);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to delete project");
        return;
      }

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
        <FolderOpen size={24} className="text-[#635bff]" />
        <h2 className="text-2xl font-bold text-gray-800">Manage Projects</h2>
        <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {pagination.totalProjects} total
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
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
      {projects.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <FolderOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No projects found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Budget</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{project.title}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">₹{project.budget}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{project.client?.name || "Unknown"}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProjects} projects)
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => loadProjects(pagination.currentPage - 1)}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => loadProjects(pagination.currentPage + 1)}
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

export default AdminProjects;