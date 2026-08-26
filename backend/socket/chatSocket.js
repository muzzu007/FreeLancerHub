const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

function registerChatSocket(io, socket) {

    socket.on(
        "send_message",
        async (payload) => {

            try {

                const {
                    conversationId,
                    text
                } = payload || {};

                // ---------------------------------------
                // Validate conversation ID
                // ---------------------------------------

                if (!conversationId) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Conversation ID is required"
                        }
                    );

                    return;
                }

                // ---------------------------------------
                // Validate text
                // ---------------------------------------

                if (typeof text !== "string") {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Message text is required"
                        }
                    );

                    return;
                }

                const cleanText = text.trim();

                if (!cleanText) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Message cannot be empty"
                        }
                    );

                    return;
                }

                if (cleanText.length > 2000) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Message cannot exceed 2000 characters"
                        }
                    );

                    return;
                }

                // ---------------------------------------
                // Verify socket conversation
                // ---------------------------------------

                if (
                    conversationId.toString() !==
                    socket.conversationId
                ) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Invalid conversation"
                        }
                    );

                    return;
                }

                // ---------------------------------------
                // Find conversation
                // ---------------------------------------

                const conversation =
                    await Conversation.findById(
                        conversationId
                    );

                if (!conversation) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "Conversation not found"
                        }
                    );

                    return;
                }

                // ---------------------------------------
                // Verify participant
                // ---------------------------------------

                const userId =
                    socket.user.userId.toString();

                const isClient =
                    conversation.client.toString() ===
                    userId;

                const isFreelancer =
                    conversation.freelancer.toString() ===
                    userId;

                if (
                    !isClient &&
                    !isFreelancer
                ) {

                    socket.emit(
                        "error",
                        {
                            message:
                                "You are not a participant in this conversation"
                        }
                    );

                    return;
                }

                // ---------------------------------------
                // Broadcast the latest message
                // ---------------------------------------

                // The REST API saves the message.
                // We fetch the most recent message and broadcast it.
                const latestMessage =
                    await Message.findOne({
                        conversation: conversation._id
                    })
                        .sort({ createdAt: -1 })
                        .populate("sender", "name role");

                if (!latestMessage) {
                    // No message found (shouldn't happen)
                    socket.emit(
                        "error",
                        {
                            message:
                                "No message found to broadcast"
                        }
                    );
                    return;
                }

                // Broadcast to the room
                const room =
                    `conversation:${conversationId}`;

                io.to(room).emit(
                    "receive_message",
                    latestMessage
                );

            } catch (error) {

                console.error(
                    "Socket message error:",
                    error
                );

                socket.emit(
                    "error",
                    {
                        message:
                            "Unable to send message"
                    }
                );
            }
        }
    );
}

module.exports = registerChatSocket;