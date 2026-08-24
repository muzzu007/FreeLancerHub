import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
    getOrCreateConversation,
    getMessages,
    sendMessage
} from "../../services/conversationService";
import { updateProposalStatus } from "../../services/proposalService";

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

    // ✅ Robust participant check – handles both string IDs and populated objects
    const clientId = typeof project?.client === "object" 
        ? project.client._id 
        : project?.client;
    
    const freelancerId = typeof proposal?.freelancer === "object" 
        ? proposal.freelancer._id 
        : proposal?.freelancer;

    const isClient = user?.id === clientId;
    const isFreelancer = user?.id === freelancerId;
    const isPending = proposal?.status === "pending";

    // Load conversation and messages
    useEffect(() => {
        const loadChat = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Get or create conversation
                const convResponse = await getOrCreateConversation(proposal._id);
                const convData = await convResponse.json();

                if (!convResponse.ok) {
                    setError(convData.message || "Unable to open chat");
                    setLoading(false);
                    return;
                }

                setConversation(convData.conversation);

                // 2. Load messages
                const msgResponse = await getMessages(convData.conversation._id);
                const msgData = await msgResponse.json();

                if (!msgResponse.ok) {
                    setError(msgData.message || "Unable to load messages");
                    setLoading(false);
                    return;
                }

                setMessages(msgData.messages || []);

            } catch (error) {
                console.error(error);
                setError("Unable to reach server");
            } finally {
                setLoading(false);
            }
        };

        if (proposal?._id) {
            loadChat();
        }
    }, [proposal, onClose]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Handle sending message
    const handleSendMessage = async (event) => {
        event.preventDefault();

        const text = newMessage.trim();
        if (!text || !conversation) return;

        try {
            setSending(true);
            setError(null);

            const response = await sendMessage(conversation._id, text);
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to send message");
                return;
            }

            setMessages((prev) => [...prev, data.message]);
            setNewMessage("");

        } catch (error) {
            console.error(error);
            setError("Unable to reach server");
        } finally {
            setSending(false);
        }
    };

    // Handle Accept/Reject
    const handleStatusChange = async (status) => {
        const confirmMessage = status === "accepted"
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
            setUpdatingStatus(false);
        }
    };

    const canAccept = isClient && isPending && messages.length > 0;

    // Check if user is participant
    if (!isClient && !isFreelancer) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        maxWidth: "400px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3>Access Denied</h3>
                    <p>You are not a participant in this conversation.</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    width: "500px",
                    maxWidth: "90%",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>
                        Chat with {isClient ? proposal?.freelancer?.name || "Freelancer" : project?.client?.name || "Client"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer"
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Project info */}
                <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "14px" }}>
                    Project: {project?.title} | Bid: ₹{proposal?.bidAmount}
                </p>

                {/* Error message */}
                {error && (
                    <div
                        style={{
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            padding: "10px",
                            borderRadius: "4px",
                            marginBottom: "12px",
                            fontSize: "14px"
                        }}
                    >
                        ❌ {error}
                    </div>
                )}

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        border: "1px solid #eee",
                        borderRadius: "4px",
                        padding: "12px",
                        minHeight: "200px",
                        maxHeight: "300px",
                        marginBottom: "12px"
                    }}
                >
                    {loading ? (
                        <p style={{ color: "#666" }}>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p style={{ color: "#666" }}>No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                style={{
                                    marginBottom: "8px",
                                    textAlign: msg.sender._id === user?.id ? "right" : "left"
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        backgroundColor: msg.sender._id === user?.id ? "#007bff" : "#f1f1f1",
                                        color: msg.sender._id === user?.id ? "white" : "#333",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        maxWidth: "80%",
                                        wordWrap: "break-word"
                                    }}
                                >
                                    <strong style={{ fontSize: "12px", display: "block" }}>
                                        {msg.sender.name}
                                    </strong>
                                    {msg.text}
                                    <small style={{ fontSize: "10px", display: "block", opacity: 0.7 }}>
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending || !isPending || loading}
                        style={{
                            flex: 1,
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim() || !isPending || loading}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </form>

                {/* Accept/Reject buttons (Client only) */}
                {isClient && isPending && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "16px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
                        <button
                            type="button"
                            onClick={() => handleStatusChange("accepted")}
                            disabled={updatingStatus || !canAccept}
                            style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: canAccept ? "#28a745" : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: canAccept ? "pointer" : "not-allowed"
                            }}
                            title={!canAccept && messages.length === 0 ? "Send at least one message before accepting" : ""}
                        >
                            {updatingStatus ? "Processing..." : "✓ Accept Proposal"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange("rejected")}
                            disabled={updatingStatus}
                            style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            {updatingStatus ? "Processing..." : "✗ Reject"}
                        </button>
                    </div>
                )}

                {/* Status message for non-pending proposals */}
                {!isPending && (
                    <p style={{ marginTop: "12px", color: "#666", textAlign: "center" }}>
                        This proposal is {proposal?.status}. Chat is read-only.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ChatModal;