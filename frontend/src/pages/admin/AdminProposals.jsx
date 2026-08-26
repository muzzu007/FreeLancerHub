import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";
import {
  getAdminProposals,
  deleteProposalAsAdmin,
} from "../../services/adminService";
import { FileText, Search, Trash2, RefreshCw } from "lucide-react";

function AdminProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProposals: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });

  const loadProposals = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProposals({ ...filters, page });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load proposals");
        return;
      }

      setProposals(data.proposals);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      setError("Unable to reach server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals(1);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadProposals(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      page: 1,
      limit: 10,
    });
    loadProposals(1);
  };

  const handleDeleteProposal = async (proposalId) => {
    const confirmed = await confirm({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Delete",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    try {
      const response = await deleteProposalAsAdmin(proposalId);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to delete proposal");
        return;
      }

      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      withdrawn: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading && proposals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposals...</p>
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
        <FileText size={24} className="text-[#635bff]" />
        <h2 className="text-2xl font-bold text-gray-800">Manage Proposals</h2>
        <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {pagination.totalProposals} total
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition bg-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
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
      {proposals.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No proposals found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Project</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Freelancer</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Bid</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">
                      {proposal.project?.title || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {proposal.freelancer?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">₹{proposal.bidAmount}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteProposal(proposal._id)}
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
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProposals} proposals)
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage <= 1}
                onClick={() => loadProposals(pagination.currentPage - 1)}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => loadProposals(pagination.currentPage + 1)}
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

export default AdminProposals;