function ProposalForm({
    proposalProjectId,
    projects,
    bidAmount,
    coverLetter,
    submittingProposal,
    setBidAmount,
    setCoverLetter,
    handleSubmitProposal,
    handleCancelProposal
}) {
    if (!proposalProjectId) {
        return null;
    }

    const project = projects.find(
        (project) => project._id === proposalProjectId
    );

    return (
        <form onSubmit={handleSubmitProposal}>

            <h2>Submit Proposal</h2>

            {project && (
                <p>
                    Applying to project:{" "}
                    <strong>{project.title}</strong>
                </p>
            )}

            <div>
                <label>Bid Amount</label>

                <input
                    type="number"
                    value={bidAmount}
                    onChange={(event) =>
                        setBidAmount(event.target.value)
                    }
                />
            </div>

            <div>
                <label>Cover Letter</label>

                <textarea
                    value={coverLetter}
                    onChange={(event) =>
                        setCoverLetter(event.target.value)
                    }
                />
            </div>

            <button
                type="submit"
                disabled={submittingProposal}
            >
                {submittingProposal
                    ? "Submitting..."
                    : "Submit Proposal"}
            </button>

            <button
                type="button"
                onClick={handleCancelProposal}
                disabled={submittingProposal}
            >
                Cancel
            </button>

        </form>
    );
}

export default ProposalForm;