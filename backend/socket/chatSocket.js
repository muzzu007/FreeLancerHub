const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


function registerChatSocket(io, socket) {

    socket.on(
        "send_message",
        async (payload) => {

            try {

                // ---------------------------------------
                // Extract payload FIRST
                // ---------------------------------------

                const {
                    conversationId,
                    text
                } = payload || {};


                // ---------------------------------------
                // Debug log
                // ---------------------------------------

                console.log(
                    "[SOCKET] send_message received",
                    {
                        user: socket.user.userId,
                        conversationId,
                        text
                    }
                );


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


                const cleanText =
                    text.trim();


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
                // Make sure this socket is sending
                // to the conversation it joined
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
                // Create message
                // ---------------------------------------

                const message =
                    await Message.create({
                        conversation:
                            conversation._id,

                        sender:
                            socket.user.userId,

                        text:
                            cleanText
                    });


                // ---------------------------------------
                // Populate sender
                // ---------------------------------------

                const populatedMessage =
                    await Message.findById(
                        message._id
                    )
                        .populate(
                            "sender",
                            "name role"
                        );


                // ---------------------------------------
                // Update conversation timestamp
                // ---------------------------------------

                conversation.updatedAt =
                    new Date();

                await conversation.save();


                // ---------------------------------------
                // Conversation room
                // ---------------------------------------

                const room =
                    `conversation:${conversationId}`;


                // ---------------------------------------
                // Debug logs
                // ---------------------------------------

                // console.log(
                //     "[SOCKET] Broadcasting receive_message",
                //     {
                //         room,
                //         messageId:
                //             populatedMessage._id.toString()
                //     }
                // );


                console.log(
                    "[SOCKET] Room sockets:",
                    io.sockets.adapter.rooms.get(room)
                        ? [
                            ...io.sockets.adapter.rooms.get(
                                room
                            )
                        ]
                        : []
                );


                // ---------------------------------------
                // Broadcast message
                // ---------------------------------------

                io.to(room).emit(
                    "receive_message",
                    populatedMessage
                );


                console.log(
                    "[SOCKET] Message broadcast successful"
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