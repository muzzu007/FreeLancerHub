const jwt = require("jsonwebtoken");

const Conversation = require("../models/Conversation");
const registerChatSocket = require("./chatSocket");


function authenticateSocket(socket, next) {

    try {

        const cookieHeader =
            socket.handshake.headers.cookie;

        if (!cookieHeader) {
            return next(
                new Error("Authentication required")
            );
        }

        const cookies = {};

        cookieHeader
            .split(";")
            .forEach((cookie) => {

                const [name, ...valueParts] =
                    cookie.trim().split("=");

                if (!name) {
                    return;
                }

                cookies[name] =
                    decodeURIComponent(
                        valueParts.join("=")
                    );
            });

        const accessToken =
            cookies.accessToken;

        if (!accessToken) {
            return next(
                new Error("Authentication required")
            );
        }

        const decoded =
            jwt.verify(
                accessToken,
                process.env.JWT_SECRET
            );

        socket.user = decoded;

        next();

    } catch (error) {

        console.error(
            "Socket authentication error:",
            error.message
        );

        next(
            new Error(
                "Invalid authentication token"
            )
        );
    }
}


async function getConversationAccess(
    conversationId,
    userId
) {

    const conversation =
        await Conversation.findById(
            conversationId
        );

    if (!conversation) {
        return null;
    }

    const isClient =
        conversation.client.toString() ===
        userId.toString();

    const isFreelancer =
        conversation.freelancer.toString() ===
        userId.toString();

    if (!isClient && !isFreelancer) {
        return false;
    }

    return conversation;
}


function initializeSocket(io) {

    io.use(authenticateSocket);

    io.on("connection", async (socket) => {

        const conversationId =
            socket.handshake.query.conversationId;

        if (!conversationId) {

            socket.emit(
                "error",
                {
                    message:
                        "Conversation ID is required"
                }
            );

            socket.disconnect();

            return;
        }

        try {

            const conversation =
                await getConversationAccess(
                    conversationId,
                    socket.user.userId
                );

            if (!conversation) {

                socket.emit(
                    "error",
                    {
                        message:
                            "Conversation not found"
                    }
                );

                socket.disconnect();

                return;
            }

            if (conversation === false) {

                socket.emit(
                    "error",
                    {
                        message:
                            "You are not a participant in this conversation"
                    }
                );

                socket.disconnect();

                return;
            }

            const room =
                `conversation:${conversationId}`;

            socket.join(room);

            socket.conversationId =
                conversationId.toString();

            registerChatSocket(
                io,
                socket
            );

            socket.on(
                "disconnect",
                () => {
                    // Socket.IO handles room cleanup automatically.
                }
            );

        } catch (error) {

            console.error(
                "Socket connection error:",
                error
            );

            socket.emit(
                "error",
                {
                    message:
                        "Unable to connect to conversation"
                }
            );

            socket.disconnect();
        }
    });
}


module.exports = initializeSocket;