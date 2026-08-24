import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ChatModal from "../chat/ChatModal";
import {
  MessageSquare,
  XCircle,
  User,
  Mail,
  DollarSign,
  FileText,
} from "lucide-react";

function ProposalCard({ proposal, onProposalUpdated, project }) {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const isClient = user?.id === project?.client?._id;
  const isPending = proposal?.status === "pending";

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      withdrawn: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Freelancer Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#635bff] to-[#00d4b2] flex items-center justify-center text-white font-semibold text-sm">
                {proposal.freelancer?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {proposal.freelancer?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail size={14} className="text-gray-400" />
                  {proposal.freelancer?.email || "No email"}
                </p>
              </div>
            </div>

            {/* Bid */}
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
              <DollarSign size={16} className="text-gray-400" />
              Bid: <span className="font-semibold text-gray-800">₹{proposal.bidAmount}</span>
            </p>

            {/* Cover Letter */}
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText size={14} className="text-gray-400" />
                Cover Letter:
              </p>
              <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {proposal.coverLetter}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex flex-col sm:flex-row gap-2">
              {isClient && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowChat(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                  >
                    <MessageSquare size={18} />
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reject this proposal?")) {
                        onProposalUpdated(proposal._id, "rejected");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </>
              )}

              {!isClient && (
                <button
                  type="button"
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                >
                  <MessageSquare size={18} />
                  Chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          proposal={proposal}
          project={project}
          onClose={() => setShowChat(false)}
          onProposalUpdated={onProposalUpdated}
        />
      )}
    </>
  );
}

export default ProposalCard;