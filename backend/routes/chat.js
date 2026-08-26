const express = require("express");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const validateObjectId = require(
    "../middleware/validateObjectId"
);

const router = express.Router();


// =====================================================
// CREATE / GET CONVERSATION FOR A PROPOSAL
// =====================================================

router.post(
    "/",
    protect,
    async (req, res, next) => {
        try {

            const { proposal: proposalId } = req.body;

            if (!proposalId) {
                return res.status(400).json({
                    message: "Proposal ID is required"
                });
            }

            const proposal =
                await Proposal.findById(proposalId);

            if (!proposal) {
                return res.status(404).json({
                    message: "Proposal not found"
                });
            }

            if (proposal.status !== "pending") {
                return res.status(409).json({
                    message:
                        "Chat is only available for pending proposals"
                });
            }

            const project =
                await Project.findById(proposal.project);

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            const userId = req.user.userId;

            const isClient =
                project.client.toString() === userId;

            const isFreelancer =
                proposal.freelancer.toString() === userId;

            if (!isClient && !isFreelancer) {
                return res.status(403).json({
                    message:
                        "You are not part of this proposal"
                });
            }

            let conversation =
                await Conversation.findOne({
                    proposal: proposal._id
                })
                    .populate(
                        "client",
                        "name email role"
                    )
                    .populate(
                        "freelancer",
                        "name email role"
                    )
                    .populate(
                        "project",
                        "title budget status"
                    )
                    .populate(
                        "proposal",
                        "bidAmount status"
                    );

            if (!conversation) {

                try {

                    conversation =
                        await Conversation.create({
                            project: project._id,
                            proposal: proposal._id,
                            client: project.client,
                            freelancer: proposal.freelancer
                        });

                } catch (error) {

                    // Another request may have created
                    // the conversation at the same time.
                    if (error.code === 11000) {

                        conversation =
                            await Conversation.findOne({
                                proposal: proposal._id
                            });

                    } else {

                        throw error;
                    }
                }

                conversation =
                    await Conversation.findById(
                        conversation._id
                    )
                        .populate(
                            "client",
                            "name email role"
                        )
                        .populate(
                            "freelancer",
                            "name email role"
                        )
                        .populate(
                            "project",
                            "title budget status"
                        )
                        .populate(
                            "proposal",
                            "bidAmount status"
                        );
            }
            res.status(200).json({
                conversation
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET MY CONVERSATIONS
// =====================================================

router.get(
    "/",
    protect,
    async (req, res, next) => {
        try {

            const userId = req.user.userId;

            const conversations =
                await Conversation.find({
                    $or: [
                        { client: userId },
                        { freelancer: userId }
                    ]
                })
                    .populate(
                        "client",
                        "name email role"
                    )
                    .populate(
                        "freelancer",
                        "name email role"
                    )
                    .populate(
                        "project",
                        "title budget status"
                    )
                    .populate(
                        "proposal",
                        "bidAmount status"
                    )
                    .sort({
                        updatedAt: -1
                    });

            res.status(200).json({
                conversations
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET SINGLE CONVERSATION
// =====================================================

router.get(
    "/:id",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const conversation =
                await Conversation.findById(
                    req.params.id
                )
                    .populate(
                        "client",
                        "name email role"
                    )
                    .populate(
                        "freelancer",
                        "name email role"
                    )
                    .populate(
                        "project",
                        "title budget status"
                    )
                    .populate(
                        "proposal",
                        "bidAmount status"
                    );

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found"
                });
            }

            const userId =
                req.user.userId;

            const isParticipant =
                conversation.client._id.toString() ===
                userId ||
                conversation.freelancer._id.toString() ===
                userId;

            if (!isParticipant) {
                return res.status(403).json({
                    message:
                        "You cannot access this conversation"
                });
            }

            res.status(200).json({
                conversation
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// GET MESSAGES
// =====================================================

router.get(
    "/:id/messages",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const conversation =
                await Conversation.findById(
                    req.params.id
                );

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found"
                });
            }

            const userId =
                req.user.userId;

            const isParticipant =
                conversation.client.toString() ===
                userId ||
                conversation.freelancer.toString() ===
                userId;

            if (!isParticipant) {
                return res.status(403).json({
                    message:
                        "You cannot access these messages"
                });
            }

            const messages =
                await Message.find({
                    conversation:
                        conversation._id
                })
                    .populate(
                        "sender",
                        "name role"
                    )
                    .sort({
                        createdAt: 1
                    });

            res.status(200).json({
                messages
            });

        } catch (error) {
            next(error);
        }
    }
);


// =====================================================
// SEND MESSAGE
// =====================================================

router.post(
    "/:id/messages",
    protect,
    validateObjectId("id"),
    async (req, res, next) => {
        try {

            const { text } = req.body;

            if (
                !text ||
                typeof text !== "string"
            ) {
                return res.status(400).json({
                    message:
                        "Message text is required"
                });
            }

            const cleanText =
                text.trim();

            if (!cleanText) {
                return res.status(400).json({
                    message:
                        "Message cannot be empty"
                });
            }

            const conversation =
                await Conversation.findById(
                    req.params.id
                );

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found"
                });
            }

            const userId =
                req.user.userId;

            const isParticipant =
                conversation.client.toString() ===
                userId ||
                conversation.freelancer.toString() ===
                userId;

            if (!isParticipant) {
                return res.status(403).json({
                    message:
                        "You cannot send messages in this conversation"
                });
            }

            const proposal =
                await Proposal.findById(
                    conversation.proposal
                );

            if (!proposal) {
                return res.status(404).json({
                    message:
                        "Proposal not found"
                });
            }

            if (
                proposal.status === "rejected" ||
                proposal.status === "withdrawn"
            ) {
                return res.status(409).json({
                    message:
                        "This proposal is no longer active"
                });
            }

            const message =
                await Message.create({
                    conversation:
                        conversation._id,
                    sender: userId,
                    text: cleanText
                });

            conversation.updatedAt = new Date();
            await conversation.save();

            const populatedMessage =
                await Message.findById(
                    message._id
                ).populate(
                    "sender",
                    "name role"
                );

            res.status(201).json({
                message:
                    populatedMessage
            });

        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;

