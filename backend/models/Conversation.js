const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        proposal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: true,
            unique: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

conversationSchema.index(
    {
        project: 1,
        client: 1,
        freelancer: 1
    }
);

module.exports = mongoose.model(
    "Conversation",
    conversationSchema
);
