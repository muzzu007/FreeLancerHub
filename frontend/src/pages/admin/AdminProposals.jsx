import { useEffect, useState } from "react";
import {
    getAdminProposals,
    deleteProposalAsAdmin
} from "../../services/adminService";

function AdminProposals() {

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProposals: 0
    });

    const [filters, setFilters] = useState({
        status: "",
        page: 1,
        limit: 10
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
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        loadProposals(1);
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            page: 1,
            limit: 10
        });
        loadProjects(1);
    };

    const handleDeleteProposal = async (proposalId) => {
        const confirmed = window.confirm("Are you sure you want to delete this proposal?");
        if (!confirmed) return;

        try {
            const response = await deleteProposalAsAdmin(proposalId);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to delete proposal");
                return;
            }

            setProposals(prev => prev.filter(p => p._id !== proposalId));
            alert(data.message);

        } catch (error) {
            console.error(error);
            alert("Unable to reach server");
        }
    };

    if (loading && proposals.length === 0) {
        return <p>Loading proposals...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Manage Proposals</h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                </select>
                <button onClick={handleApplyFilters}>Apply</button>
                <button onClick={handleClearFilters}>Clear</button>
            </div>

            {proposals.length === 0 ? (
                <p>No proposals found.</p>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
                                <th>Project</th>
                                <th>Freelancer</th>
                                <th>Bid</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map((proposal) => (
                                <tr key={proposal._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td>{proposal.project?.title || "Unknown"}</td>
                                    <td>{proposal.freelancer?.name || "Unknown"}</td>
                                    <td>₹{proposal.bidAmount}</td>
                                    <td>{proposal.status}</td>
                                    <td>
                                        <button onClick={() => handleDeleteProposal(proposal._id)} style={{ color: "red" }}>
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
                            onClick={() => loadProposals(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span style={{ margin: "0 12px" }}>
                            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProposals} proposals)
                        </span>
                        <button
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => loadProposals(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminProposals;