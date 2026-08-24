import ProposalList from "./ProposalList";
import { X, Loader2 } from "lucide-react";

function ProjectProposals({
    viewingProposals,
    loadingProposals,
    proposals,
    handleProposalStatus,
    project,
    onClose
}) {
    if (!viewingProposals) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Project Proposals</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                    <X size={20} />
                </button>
            </div>

            {loadingProposals ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-[#635bff]" />
                </div>
            ) : (
                <ProposalList
                    proposals={proposals}
                    handleProposalStatus={handleProposalStatus}
                    project={project}
                />
            )}
        </div>
    );
}

export default ProjectProposals;