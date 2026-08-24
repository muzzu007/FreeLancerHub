import ProposalCard from "./ProposalCard";
import { FileText } from "lucide-react";

function ProposalList({ proposals, handleProposalStatus, project }) {
  if (proposals.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500">No proposals found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Proposals ({proposals.length})
      </h2>
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal._id}
            proposal={proposal}
            project={project}
            onProposalUpdated={handleProposalStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default ProposalList;