function ProposalForm({
    project,                // ✅ single project object
    bidAmount,
    coverLetter,
    submittingProposal,
    setBidAmount,
    setCoverLetter,
    handleSubmitProposal,
    handleCancelProposal
}) {

    if (!project) {
        return null;
    }

    return (
        <form onSubmit={handleSubmitProposal}>
            <h2>Submit Proposal</h2>

            <p>
                Applying to project:{" "}
                <strong>{project.title}</strong>
            </p>

            <div>
                <label>Bid Amount</label>
                <input
                    type="number"
                    value={bidAmount}
                    onChange={(event) =>
                        setBidAmount(event.target.value)
                    }
                    min="1"
                    required
                />
            </div>

            <div>
                <label>Cover Letter</label>
                <textarea
                    value={coverLetter}
                    onChange={(event) =>
                        setCoverLetter(event.target.value)
                    }
                    minLength={20}
                    rows={5}
                    required
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