import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import {
    getMyProposals,
    withdrawProposal
} from "../services/proposalService";
import ChatModal from "../components/chat/ChatModal";
import { MessageSquare, XCircle, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

function MyProposals() {

    const { user } = useAuth();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedProposal, setSelectedProposal] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showChat, setShowChat] = useState(false);

    const loadProposals = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getMyProposals();
            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to load proposals"
                );

                return;
            }

            setProposals(data.proposals || []);

        } catch (error) {

            console.error(error);
            setError("Unable to reach server");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        if (user?.id) {
            loadProposals();
        }

    }, [user]);

    const handleWithdraw = async (proposalId) => {

        const confirmed = window.confirm(
            "Are you sure you want to withdraw this proposal?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await withdrawProposal(proposalId);
            const data = await response.json();

            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Unable to withdraw proposal"
                );

                return;
            }

            setProposals(
                (previousProposals) =>
                    previousProposals.map(
                        (proposal) =>
                            proposal._id === proposalId
                                ? data.proposal
                                : proposal
                    )
            );

            toast.success("Proposal withdrawn successfully");

        } catch (error) {

            console.error(error);
            toast.error("Unable to reach server");
        }
    };

    const handleOpenChat = (proposal) => {
        setSelectedProposal(proposal);
        setSelectedProject(proposal.project);
        setShowChat(true);
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setSelectedProposal(null);
        setSelectedProject(null);
    };

    // Status badge helper
    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            withdrawn: "bg-gray-100 text-gray-800"
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Proposals</h1>
                <p className="text-gray-500 mt-1">Track all your submitted proposals</p>
            </div>

            {proposals.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">You have not submitted any proposals yet.</p>
                    <a
                        href="/projects"
                        className="inline-block mt-4 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                    >
                        Browse Projects
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map((proposal) => {

                        const isPending = proposal.status === "pending";

                        return (
                            <div
                                key={proposal._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {proposal.project?.title || "Project"}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                            <span>Bid: ₹{proposal.bidAmount}</span>
                                            <span className="flex items-center gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                                                    {proposal.status}
                                                </span>
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                                                {proposal.coverLetter}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {isPending && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenChat(proposal)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                                            >
                                                <MessageSquare size={18} />
                                                Chat
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleWithdraw(proposal._id)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                            >
                                                <XCircle size={18} />
                                                Withdraw
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Chat Modal */}
            {showChat && selectedProposal && selectedProject && (
                <ChatModal
                    proposal={selectedProposal}
                    project={selectedProject}
                    onClose={handleCloseChat}
                    onProposalUpdated={(updatedProposal) => {
                        loadProposals();
                        handleCloseChat();
                    }}
                />
            )}
        </div>
    );
}

export default MyProposals;