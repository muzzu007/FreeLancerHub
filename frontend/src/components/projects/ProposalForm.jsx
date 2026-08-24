import { Send, X, DollarSign, FileText } from "lucide-react";

function ProposalForm({
  project,
  bidAmount,
  coverLetter,
  submittingProposal,
  setBidAmount,
  setCoverLetter,
  handleSubmitProposal,
  handleCancelProposal,
}) {
  if (!project) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit Proposal</h2>

      <p className="text-sm text-gray-600 mb-4">
        Applying to project:{" "}
        <span className="font-semibold text-gray-800">{project.title}</span>
      </p>

      <form onSubmit={handleSubmitProposal} className="space-y-4">
        {/* Bid Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Bid Amount *
          </label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              min="1"
              required
              placeholder="Enter your bid amount..."
            />
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Cover Letter *
          </label>
          <div className="relative">
            <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              minLength={20}
              rows={5}
              required
              placeholder="Explain why you're the best fit for this project (min 20 characters)..."
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {coverLetter.length}/20 characters minimum
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submittingProposal}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {submittingProposal ? "Submitting..." : "Submit Proposal"}
          </button>
          <button
            type="button"
            onClick={handleCancelProposal}
            disabled={submittingProposal}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProposalForm;