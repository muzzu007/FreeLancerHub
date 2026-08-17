import ProposalCard from "./ProposalCard";

function ProposalList({
    proposals,
    handleProposalStatus
}) {
    return (
        <div>

            <h2>Proposals</h2>

            {proposals.length === 0 ? (
                <p>No proposals found.</p>
            ) : (
                proposals.map((proposal) => (
                    <ProposalCard
                        key={proposal._id}
                        proposal={proposal}
                        handleProposalStatus={
                            handleProposalStatus
                        }
                    />
                ))
            )}

        </div>
    );
}

export default ProposalList;