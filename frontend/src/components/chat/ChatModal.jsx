import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import {
  getOrCreateConversation,
  getMessages,
  sendMessage as sendMessageRest,
} from "../../services/conversationService";
import { updateProposalStatus } from "../../services/proposalService";
import {
  X,
  Send,
  Loader2,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

function ChatModal({ proposal, project, onClose, onProposalUpdated }) {
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const isMounted = useRef(true);

  // ✅ ULTIMATE GUARD: prevents any concurrent or rapid sends
  const isSendingRef = useRef(false);
  const cooldownRef = useRef(false);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ============================================================
  // SOCKET.IO INTEGRATION (RECEIVE ONLY)
  // ============================================================

  const onMessageReceived = useCallback(
    (newMessage) => {
      // Ignore messages sent by the current user (already added via REST)
      if (newMessage.sender?._id === user?.id) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    },
    [user?.id]
  );

  const onSocketError = useCallback((errorMsg) => {
    if (isMounted.current) {
      setError(errorMsg);
    }
  }, []);

  const { isConnected, isConnecting, sendMessage: emitBroadcast } = useSocket(
    conversation?._id,
    onMessageReceived,
    onSocketError
  );

  // ============================================================
  // LOAD CONVERSATION & MESSAGES (REST)
  // ============================================================

  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setError(null);

        const convResponse = await getOrCreateConversation(proposal._id);
        const convData = await convResponse.json();

        if (!convResponse.ok) {
          setError(convData.message || "Unable to open chat");
          setLoading(false);
          return;
        }

        if (!convData.conversation) {
          setError("No conversation found");
          setLoading(false);
          return;
        }

        setConversation(convData.conversation);

        const msgResponse = await getMessages(convData.conversation._id);
        const msgData = await msgResponse.json();

        if (!msgResponse.ok) {
          setError(msgData.message || "Unable to load messages");
          setLoading(false);
          return;
        }

        setMessages(msgData.messages || []);
        setLoading(false);
      } catch (error) {
        console.error("LoadChat error:", error);
        setError("Unable to reach server");
        setLoading(false);
      }
    };

    if (proposal?._id) {
      loadChat();
    } else {
      setLoading(false);
    }
  }, [proposal]);

  // ============================================================
  // SCROLL TO BOTTOM
  // ============================================================

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ============================================================
  // SEND MESSAGE (REST + SOCKET BROADCAST)
  // ============================================================

  const handleSendMessage = async (event) => {
    event.preventDefault();

    // ✅ 1. Early exit if sending or cooldown is active
    if (isSendingRef.current || cooldownRef.current) {
      return;
    }

    const text = newMessage.trim();
    if (!text || !conversation) return;

    // ✅ 2. Lock immediately to prevent double-click
    isSendingRef.current = true;
    setSending(true);
    setError(null);

    try {
      // 1. Send via REST API
      const response = await sendMessageRest(conversation._id, text);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send message");
        // Release lock
        isSendingRef.current = false;
        setSending(false);
        return;
      }

      // 2. Add the confirmed message to the state
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");

      // 3. Broadcast via Socket.IO to notify others
      if (isConnected) {
        emitBroadcast(text);
      }

      // 4. Release lock
      isSendingRef.current = false;
      setSending(false);

      // ✅ 5. Activate cooldown to prevent accidental re-send
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, 300);

    } catch (error) {
      console.error("Send message error:", error);
      setError("Unable to reach server");
      // Release lock on error
      isSendingRef.current = false;
      setSending(false);
    }
  };

  // ============================================================
  // ACCEPT / REJECT PROPOSAL
  // ============================================================

  const handleStatusChange = async (status) => {
    const confirmMessage =
      status === "accepted"
        ? "Are you sure you want to hire this freelancer?"
        : "Are you sure you want to reject this proposal?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setUpdatingStatus(true);
      setError(null);

      const response = await updateProposalStatus(proposal._id, status);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || `Unable to ${status} proposal`);
        return;
      }

      alert(data.message);

      if (onProposalUpdated) {
        onProposalUpdated(data.proposal);
      }

      onClose();
    } catch (error) {
      console.error(error);
      setError("Unable to reach server");
    } finally {
      if (isMounted.current) setUpdatingStatus(false);
    }
  };

  // ============================================================
  // PARTICIPANT CHECKS
  // ============================================================

  const clientId =
    typeof project?.client === "object"
      ? project.client._id
      : project?.client;

  const freelancerId =
    typeof proposal?.freelancer === "object"
      ? proposal.freelancer._id
      : proposal?.freelancer;

  const isClient = user?.id === clientId;
  const isFreelancer = user?.id === freelancerId;
  const isPending = proposal?.status === "pending";
  const canAccept = isClient && isPending && messages.length > 0;

  // ============================================================
  // ACCESS DENIED
  // ============================================================

  if (!isClient && !isFreelancer) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">Access Denied</h3>
            <p className="text-gray-500 mt-2">
              You are not a participant in this conversation.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  const isInputDisabled = sending || !isPending || loading;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#635bff] to-[#00d4b2] flex items-center justify-center text-white font-semibold">
              {isClient
                ? proposal?.freelancer?.name?.charAt(0) || "F"
                : project?.client?.name?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {isClient
                  ? proposal?.freelancer?.name || "Freelancer"
                  : project?.client?.name || "Client"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  Bid: ₹{proposal?.bidAmount}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <Wifi size={12} className="text-green-500" />
                      <span className="text-green-500">Live</span>
                    </>
                  ) : isConnecting ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-yellow-500" />
                      <span className="text-yellow-500">Connecting…</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} className="text-gray-400" />
                      <span className="text-gray-400">Offline</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={32} className="animate-spin text-[#635bff]" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageIcon size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender?._id === user?.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isOwn
                        ? "bg-gradient-to-r from-[#635bff] to-[#00d4b2] text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {isOwn ? "You" : msg.sender?.name || "Unknown"}
                    </p>
                    <p className="text-sm break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition disabled:opacity-50"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isPending
                  ? "Type a message…"
                  : "This proposal is no longer active"
              }
              disabled={isInputDisabled}
            />
            <button
              type="submit"
              disabled={isInputDisabled || !newMessage.trim()}
              className="px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
          {!isConnected && !loading && (
            <p className="text-xs text-yellow-600 mt-2">
              ⚠️ Real-time updates offline. Messages still send.
            </p>
          )}
        </div>

        {/* ACCEPT / REJECT (Client only) */}
        {isClient && isPending && (
          <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              type="button"
              onClick={() => handleStatusChange("accepted")}
              disabled={updatingStatus || !canAccept}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                canAccept
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title={
                !canAccept && messages.length === 0
                  ? "Send at least one message before accepting"
                  : ""
              }
            >
              <CheckCircle size={18} />
              {updatingStatus ? "Processing…" : "Accept Proposal"}
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("rejected")}
              disabled={updatingStatus}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
            >
              <XCircle size={18} />
              {updatingStatus ? "Processing…" : "Reject"}
            </button>
          </div>
        )}

        {!isPending && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <p className="text-center text-sm text-gray-500">
              This proposal is {proposal?.status}. Chat is read‑only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icon
function MessageIcon(props) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default ChatModal;