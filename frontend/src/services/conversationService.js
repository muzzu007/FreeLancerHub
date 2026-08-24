import apiRequest from "./apiRequest";

// =====================================================
// CONVERSATIONS
// =====================================================

// Get or create a conversation for a specific proposal
export const getOrCreateConversation = (proposalId) => {
    return apiRequest("/conversations", {
        method: "POST",
        body: JSON.stringify({ proposal: proposalId })
    });
};

// Get all conversations for the logged-in user
export const getMyConversations = () => {
    return apiRequest("/conversations");
};

// Get a single conversation by ID
export const getConversation = (conversationId) => {
    return apiRequest(`/conversations/${conversationId}`);
};

// =====================================================
// MESSAGES
// =====================================================

// Get messages for a conversation
export const getMessages = (conversationId) => {
    return apiRequest(`/conversations/${conversationId}/messages`);
};

// Send a message
export const sendMessage = (conversationId, text) => {
    return apiRequest(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text })
    });
};