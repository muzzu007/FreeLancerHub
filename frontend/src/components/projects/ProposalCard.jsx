function ProposalCard({
    proposal,
    handleProposalStatus
}) {
    return (
        <div>

            <p>
                Freelancer:{" "}
                {proposal.freelancer?.name}
            </p>

            <p>
                Email:{" "}
                {proposal.freelancer?.email}
            </p>

            <p>
                Bid: ₹{proposal.bidAmount}
            </p>

            <p>
                Cover Letter:
            </p>

            <p>
                {proposal.coverLetter}
            </p>

            <p>
                Status: {proposal.status}
            </p>

            {proposal.status === "pending" && (
                <>
                    <button
                    type="button"
                        onClick={() =>
                            handleProposalStatus(
                                proposal._id,
                                "accepted"
                            )
                        }
                    >
                        Accept
                    </button>

                    <button
                    type="button"
                        onClick={() =>
                            handleProposalStatus(
                                proposal._id,
                                "rejected"
                            )
                        }
                    >
                        Reject
                    </button>
                </>
            )}

            <hr />

        </div>
    );
}

export default ProposalCard;