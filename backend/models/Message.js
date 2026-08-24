const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        text: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, "Message cannot be empty"],
            maxlength: [2000, "Message cannot exceed 2000 characters"]
        }
    },
    {
        timestamps: true
    }
);

messageSchema.index({
    conversation: 1,
    createdAt: 1
});

module.exports = mongoose.model(
    "Message",
    messageSchema
);

