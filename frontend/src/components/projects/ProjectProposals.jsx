import ProposalList from "./ProposalList";

function ProjectProposals({
    viewingProposals,
    loadingProposals,
    proposals,
    handleProposalStatus,
    onClose
}) {
    if (!viewingProposals) {
        return null;
    }

    return (
        <div>
            <h2>Project Proposals</h2>

            {loadingProposals ? (
                <p>Loading proposals...</p>
            ) : (
                <ProposalList
                    proposals={proposals}
                    handleProposalStatus={handleProposalStatus}
                />
            )}

            <button type="button" onClick={onClose}>
                Close Proposals
            </button>
        </div>
    );
}

export default ProjectProposals;